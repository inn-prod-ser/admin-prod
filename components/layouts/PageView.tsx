import { ReactNode } from "react";

import { UI } from "../shared";

interface PageViewProps {
  subtitle: string;
  title: string;
  imageUrl: string;
  content: ReactNode;
}

export const PageView = ({
  content,
  subtitle,
  title,
  imageUrl,
}: PageViewProps) => {
  return (
    <div className="flex min-h-screen w-full p-8">
      <UI.Card
        isBlurred
        className="flex h-full w-full flex-col flex-grow"
        shadow="sm"
      >
        <UI.CardHeader className="flex justify-center">
          <div className="flex items-center gap-3">
            <UI.Image
              alt="imagen del curso"
              height={40}
              radius="sm"
              src={imageUrl}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">{title}</p>
              <p className="text-small text-default-500">{subtitle}</p>
            </div>
          </div>
        </UI.CardHeader>
        <UI.Divider />
        <UI.CardBody className="flex flex-grow overflow-auto w-full">
          {content}
        </UI.CardBody>
      </UI.Card>
    </div>
  );
};
