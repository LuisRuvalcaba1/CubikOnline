import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import cubo_2x2 from "../images/2x2_Cubo.png";
import cubo_3x3 from "../images/3x3_Cubo.png";
import cubo_4x4 from "../images/4x4_Cubo.png";
import cubo_5x5 from "../images/5x5_Cubo.png";
import "./Aprendizaje.css";

function CategoryPage() {
  const navigate = useNavigate();

  const onLearn = () => {
    navigate("/learn");
    console.log("Aprendiendo");
  };

  const on2x2 = () => {
    navigate("/metodo2x2");
    console.log("2x2");
  }

  const on4x4 = () => {
    navigate("/metodo4x4");
    console.log("4x4");
  }

  const on5x5 = () => {
    navigate("/metodo5x5");
    console.log("5x5");
  }

  return (
    <div className="contenedor mb-4" id="cont">
      <div className="contenedor mb-3">
        <h2 className="titulo font-bold">Introducción</h2>
        <p className="texto font-bold">
          ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        </p>
        <div className="fila-container">
          <div className="fila-item1">
            <img onClick={on2x2} className="fila-img" src={cubo_2x2} alt="" />
            <p className="texto">Categoria 2x2</p>
          </div>
          <div className="fila-item1">
            <img onClick={onLearn} className="fila-img" src={cubo_3x3} alt="" />
            <p className="texto">Categoria 3x3</p>
          </div>
          <div className="fila-item1">
            <img onClick={on4x4} className="fila-img" src={cubo_4x4} alt="" />
            <p className="texto">Categoria 4x4</p>
          </div>
          <div className="fila-item1">
            <img onClick={on5x5} className="fila-img" src={cubo_5x5} alt="" />
            <p className="texto">Categoria 5x5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
