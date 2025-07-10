interface Props {
  idVideo: string;
}

export const ClassVideo = ( { idVideo }: Props ) => {
  return (
    <div>
      <iframe
        src={ `https://iframe.mediadelivery.net/embed/430509/${ idVideo }?autoplay=true&loop=false&muted=false&preload=true&responsive=true` }
        loading="lazy"
        style={ {
          border: 0,
          position: 'absolute',
          top: 0,
          height: '100%',
          width: '100%',
        } }
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
        allowFullScreen={ true }
      ></iframe>
    </div>
  );
};

