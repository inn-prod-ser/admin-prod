import { useState, useEffect, FC } from 'react';

interface SlideData {
  title: string;
  content: string;
}

type AnimationDirection = 'next' | 'prev' | 'enter-next' | 'enter-prev' | '';

export const ClassSlide: FC = () => {
  const slides: SlideData[] = [
    {
      title: 'Visión General de las Finanzas',
      content: 'Las <b>finanzas</b> representan el estudio y la gestión del dinero y las inversiones. Esta disciplina abarca desde la simple administración de un presupuesto personal hasta complejas estrategias de inversión corporativa y el funcionamiento de los mercados financieros globales, buscando optimizar la asignación de recursos bajo condiciones de incertidumbre.'
    },
    {
      title: 'El Pilar de las Finanzas Personales',
      content: 'Las <b>finanzas personales</b> se enfocan en cómo los individuos o familias administran sus recursos económicos. Esto incluye la elaboración de presupuestos, el ahorro estratégico, la inversión inteligente para el crecimiento patrimonial, la gestión de deudas y la planificación para metas futuras como la jubilación, la educación o adquisiciones importantes, asegurando estabilidad y bienestar financiero.'
    },
    {
      title: 'Estrategia en Finanzas Corporativas',
      content: 'Dentro del ámbito empresarial, las <b>finanzas corporativas</b> son cruciales para la toma de decisiones sobre inversión, financiación y dividendos. El objetivo primordial es maximizar el valor para los accionistas, lo cual implica la evaluación de proyectos, la estructuración óptima del capital, la gestión eficiente del flujo de caja y la rentabilidad de los activos.'
    },
    {
      title: 'Dinamismo del Sistema Financiero',
      content: 'El <b>sistema financiero</b> actúa como el motor que canaliza el ahorro hacia la inversión productiva. Se compone de instituciones (bancos, aseguradoras), mercados (bursátil, de bonos) e instrumentos (acciones, deuda) que facilitan la transferencia de fondos, promoviendo la eficiencia económica y el desarrollo.'
    },
    {
      title: 'Finanzas: Una Perspectiva Integral',
      content: 'En conclusión, la comprensión de las finanzas es fundamental en todos los niveles. Proporciona las herramientas para tomar decisiones económicas informadas, ya sea en la esfera personal, en la dirección de una empresa o en la participación en los mercados, con el fin de alcanzar objetivos financieros y prosperidad a largo plazo.'
    },
  ];

  const [ currentIndex, setCurrentIndex ] = useState<number>( 0 );
  const [ isAnimating, setIsAnimating ] = useState<boolean>( false );
  const [ direction, setDirection ] = useState<AnimationDirection>( '' );

  const navigate = ( newIndex: number, newDirection: AnimationDirection | 'next' | 'prev' ) => {
    if ( isAnimating || newIndex < 0 || newIndex >= slides.length || newDirection === '' ) return;

    setIsAnimating( true );
    setDirection( newDirection as AnimationDirection );

    setTimeout( () => {
      setCurrentIndex( newIndex );
      setDirection( newDirection === 'next' ? 'enter-next' : 'enter-prev' );
      setTimeout( () => {
        setIsAnimating( false );
        setDirection( '' );
      }, 500 );
    }, 500 );
  };

  const goToNext = () => navigate( currentIndex + 1, 'next' );
  const goToPrevious = () => navigate( currentIndex - 1, 'prev' );

  useEffect( () => {
    setDirection( 'enter-next' );
    const timer = setTimeout( () => setDirection( '' ), 500 );
    return () => clearTimeout( timer );
  }, [] );


  return (
    <div className="presentation-shell">
      <div className="presentation-header">
        <h1 className="main-title">Explorando el Universo Financiero</h1>
      </div>

      <div className="slide-carousel">
        <div className={ `slide-wrapper ${ direction }` }>
          <div className="slide-card" key={ currentIndex }>
            <h2 className="slide-title">{ slides[ currentIndex ].title }</h2>
            <p
              className="slide-content-text"
              dangerouslySetInnerHTML={ { __html: slides[ currentIndex ].content } }
            />
          </div>
        </div>
      </div>

      <div className="navigation-controls">
        <button
          onClick={ goToPrevious }
          disabled={ currentIndex === 0 || isAnimating }
          aria-label="Diapositiva anterior"
          className="nav-button prev-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
        </button>
        <div className="slide-indicator">
          { slides.map( ( _, index ) => (
            <button
              key={ index }
              className={ `dot ${ index === currentIndex ? 'active' : '' }` }
              onClick={ () => navigate( index, index > currentIndex ? 'next' : ( index < currentIndex ? 'prev' : '' ) ) }
              aria-label={ `Ir a diapositiva ${ index + 1 }` }
              disabled={ isAnimating }
            />
          ) ) }
        </div>
        <button
          onClick={ goToNext }
          disabled={ currentIndex === slides.length - 1 || isAnimating }
          aria-label="Siguiente diapositiva"
          className="nav-button next-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
        </button>
      </div>
      <style jsx global>{ `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #EAEFEC;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          color: #333;
        }
      `}</style>
      <style jsx>
        { `
          .presentation-shell {
            background-color: #A0D9D1;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(42, 92, 90, 0.2), 0 5px 15px rgba(0,0,0,0.1);
            padding: 30px 35px;
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
          }

          .presentation-header {
            text-align: center;
            margin-bottom: 25px;
          }

          .main-title {
            font-size: 2.4em;
            color: #2A5C5A;
            font-weight: 700;
            margin: 0;
          }

          .slide-carousel {
            position: relative;
            min-height: 350px;
            display: flex;
            align-items: center;
            overflow: hidden;
            margin-bottom: 25px;
          }

          .slide-wrapper {
            width: 100%;
            display: flex;
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          
          .slide-wrapper.next { transform: translateX(-100%); }
          .slide-wrapper.prev { transform: translateX(100%); }
          .slide-wrapper.enter-next { transform: translateX(0); }
          .slide-wrapper.enter-prev { transform: translateX(0); }

          .slide-card {
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 15px;
            padding: 25px 30px;
            min-width: 100%;
            box-sizing: border-box;
            box-shadow: 0 5px 15px rgba(42, 92, 90, 0.1);
            opacity: 0;
            transform: scale(0.95);
            animation: fadeInSlide 0.5s 0.25s forwards;
          }
          
          .slide-wrapper.next .slide-card,
          .slide-wrapper.prev .slide-card {
            animation: fadeOutSlide 0.25s forwards;
          }


          @keyframes fadeInSlide {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes fadeOutSlide {
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }


          .slide-title {
            font-size: 1.8em;
            color: #2A5C5A;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(42, 92, 90, 0.3);
          }

          .slide-content-text {
            font-size: 1.05em;
            line-height: 1.75;
            color: #333;
            text-align: left;
          }

          .slide-content-text b {
            color: #2A5C5A;
            font-weight: 700;
          }

          .navigation-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid rgba(42, 92, 90, 0.2);
          }

          .nav-button {
            background-color: #2A5C5A;
            color: #A0D9D1;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            box-shadow: 0 2px 5px rgba(42, 92, 90, 0.2);
          }

          .nav-button:hover:not(:disabled) {
            background-color: #3b7c78;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(42, 92, 90, 0.3);
          }

          .nav-button:disabled {
            background-color: #7f9c9a;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .slide-indicator {
            display: flex;
            gap: 8px;
          }

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: rgba(42, 92, 90, 0.3);
            border: none;
            padding: 0;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .dot.active {
            background-color: #2A5C5A;
            transform: scale(1.2);
          }
          .dot:not(.active):hover:not(:disabled) {
            background-color: rgba(42, 92, 90, 0.6);
          }
          .dot:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
        `}
      </style>
    </div>
  );
};