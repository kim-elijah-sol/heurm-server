import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import fs from 'fs';
import path from 'path';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchProfile = createAPI(
  async ({
    body: { name, profileFile, currentPassword, newPassword },
    prismaClient,
    userId,
  }) => {
    if (currentPassword && newPassword) {
      const user = await prismaClient.user.findUnique({
        select: {
          password: true,
        },
        where: {
          id: userId,
        },
      });

      if (user) {
        if (user.password !== SHA256(currentPassword).toString()) {
          throw new BadRequestError('current password is incorrect');
        }
      } else {
        throw new BadRequestError('can not find user data');
      }
    }

    let profileImage: string | undefined = undefined;

    if (profileFile) {
      const originalName = profileFile.name;
      const lastDotIndex = originalName.lastIndexOf('.');

      const baseName = originalName.substring(0, lastDotIndex);
      const ext = originalName.substring(lastDotIndex + 1);

      const newFileName = `${baseName}-${new Date().valueOf()}.${ext}`;

      const uploadPath = path.join(process.cwd(), 'uploads', newFileName);

      // 업로드 폴더 없으면 생성
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      // 파일 저장
      await Bun.write(uploadPath, await profileFile.arrayBuffer());

      profileImage = `/uploads/${newFileName}`;
    }

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        profileImage,
        password: newPassword ?? undefined,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      name: v.isName,
      profileFile: t.Nullable(t.File({ format: 'image/*' })),
      currentPassword: t.Optional(t.Nullable(v.isPassword)),
      newPassword: t.Optional(t.Nullable(v.isPassword)),
    }),
  }
);
