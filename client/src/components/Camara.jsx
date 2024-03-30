import React, { Component } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl';

class Camara extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.canvasRef = React.createRef();
    }
    
    componentDidMount() {
        cocoSsd.load().then(model => {
            this.model = model;
            console.log('Modelo cargado');
        });
    }

    detectObjects = (video) => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpiar el lienzo
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crear un tensor a partir del fotograma de video
        const tensor = tf.browser.fromPixels(video)
            .resizeNearestNeighbor([300, 300])
            .expandDims()
            .toFloat();

        // Detectar objetos
        this.model.detect(tensor).then(predictions => {
            // Dibujar rectángulos delimitadores y etiquetas
            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;
                const text = `${prediction.class} ${Math.round(prediction.score * 100)}%`;

                // Imprimir objeto detectado en la consola
                console.log(`Objeto detectado: ${prediction.class}, Puntuación: ${prediction.score}`);

                // Dibujar el rectángulo delimitador
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);

                // Dibujar la etiqueta
                ctx.font = '18px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText(text, x, y > 20 ? y - 5 : y + 15);
            });
        });

        tensor.dispose();
    }

    render() {
        return (
            <div>
                <Webcam
                    ref={this.webcamRef}
                    onUserMedia={this.detectObjects}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zIndex: 9,
                        width: 640,
                        height: 480,
                    }}
                />

                <canvas
                    ref={this.canvasRef}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        zIndex: 8,
                        width: 640,
                        height: 480,
                    }}
                />
            </div>
        );
    }
}

export default Camara;