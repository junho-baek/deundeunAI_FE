import { useOutletContext } from "react-router";
import type { Route } from "./+types/public-profile-page";

export default function PublicProfilePage() {
  const { headline, bio } = useOutletContext<{
    headline: string;
    bio: string;
  }>();

  return (
    <div className="max-w-screen-md flex flex-col space-y-10">
      {headline && (
        <div className="space-y-2">
          <h4 className="text-lg font-bold">소개</h4>
          <p className="text-muted-foreground">{headline}</p>
        </div>
      )}
      {bio && (
        <div className="space-y-2">
          <h4 className="text-lg font-bold">자기소개</h4>
          <p className="text-muted-foreground">{bio}</p>
        </div>
      )}
      {!headline && !bio && (
        <div className="space-y-2">
          <h4 className="text-lg font-bold">소개</h4>
          <p className="text-muted-foreground">
            아직 프로필 정보가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

