import { Tabs, Tab, Card, CardBody } from '@heroui/react';

import { ClassSlide } from './class-slides';
import { ClassText } from './ClassText';
import { ClassVideo } from './ClassVideo';
import { CourseClassContentVideoForm, useGetClassContentByClassId } from '@/components/class-content';
import { Icons } from '@/components/shared/ui';


interface Props {
  idClass: string;
}

export const CourseContentForm = ( { idClass = "" }: Props ) => {

  const { classContents } = useGetClassContentByClassId( idClass );
  const videoContent = classContents?.find( content => content.contentType === 'video' );

  return (
    <div className="flex justify-center flex-col">
      <div className="w-full max-w-4xl mx-auto">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          className="w-full"
          classNames={ {
            tabList: "flex justify-center",
            panel: "mt-4 w-full"
          } }
        >
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2">
                <Icons.IoVideocamOutline />
                <span>Video</span>
              </div>
            }
          >
            <Card>
              <CardBody>

                <div className="inline-block">
                  <CourseClassContentVideoForm idClass={ idClass } />
                </div>

                <div style={ { position: 'relative', paddingTop: '56.25%' } }>
                  { videoContent && <ClassVideo idVideo={ videoContent.content } /> }
                </div>

              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="Texto"
            title={
              <div className="flex items-center space-x-2">
                <Icons.IoReaderOutline />
                <span>Texto</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <ClassText idClass={ idClass } />
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="Slides"
            title={
              <div className="flex items-center space-x-2">
                <Icons.IoAlbumsOutline />
                <span>Slides</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <ClassSlide />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};