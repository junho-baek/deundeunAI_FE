import { type ActionFunctionArgs, data } from "react-router";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId } from "~/features/users/queries";
import { updateUserAvatar } from "~/features/users/mutations";

export async function action({ request }: ActionFunctionArgs) {
  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client);

  const formData = await request.formData();
  const avatar = formData.get("avatar");

  if (!avatar || !(avatar instanceof File)) {
    return data({ formErrors: { avatar: ["파일을 선택해주세요."] } }, { status: 400 });
  }

  // 파일 크기 및 타입 검증 (2MB = 2097152 bytes)
  if (avatar.size > 2097152 || !avatar.type.startsWith("image/")) {
    return data(
      { formErrors: { avatar: ["파일 크기는 2MB 이하이고 이미지 파일이어야 합니다."] } },
      { status: 400 }
    );
  }

  try {
    // Supabase Storage에 업로드 (타임스탬프 추가로 고유 경로 생성)
    const { data: uploadData, error: uploadError } = await client.storage
      .from("avatars")
      .upload(`${profileId}/${Date.now()}`, avatar, {
        contentType: avatar.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("아바타 업로드 실패:", uploadError);
      return data({ formErrors: { avatar: ["아바타 업로드에 실패했습니다."] } }, { status: 500 });
    }

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = await client.storage.from("avatars").getPublicUrl(uploadData.path);

    // 프로필 업데이트
    await updateUserAvatar(client, {
      id: profileId,
      avatarUrl: publicUrl,
    });

    // 성공 시 아바타 URL 반환 (페이지 리로드 없이 업데이트)
    return data({ ok: true, avatarUrl: publicUrl });
  } catch (error) {
    console.error("아바타 업로드 중 오류:", error);
    return data(
      { formErrors: { avatar: ["아바타 업로드 중 오류가 발생했습니다."] } },
      { status: 500 }
    );
  }
}

