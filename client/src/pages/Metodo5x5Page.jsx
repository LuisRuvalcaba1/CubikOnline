import "./Aprendizaje.css";

function Metodo5x5Page() {
  return (
    <div className="contenedor" id="cont">
      <div className="contenedor">
        <h1 className="titulo font-bold">Metodo para cubo 5x5</h1>
        <div className="video-container">
          <div className="contenedor">
            <iframe
              src="https://www.youtube.com/embed/6uaq-xfFs98" // URL actualizada
              className=" h-full w-full rounded-lg"
              width="100%"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metodo5x5Page;
