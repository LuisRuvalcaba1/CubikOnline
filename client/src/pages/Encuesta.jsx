import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSurvey } from '../context/SurveyContext';

const Encuesta = () => {
    const { isAuthenticated, user } = useAuth();
    const { createSurvey } = useSurvey();
    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyAnswers, setSurveyAnswers] = useState({
      situation: '',
      hardestStep: '',
      solveTime: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      const checkRegistrationDate = async () => {
        try {
          if (!isAuthenticated) return;
  
          const registrationDate = new Date(user.createdAt);
          const currentDate = new Date();
          const diffInDays = Math.ceil((currentDate - registrationDate) / (1000 * 60 * 60 * 24));
  
          if (diffInDays >= 7) {
            setShowSurvey(true);
          }
        } catch (err) {
          console.error(err);
        }
      };
  
      checkRegistrationDate();
    }, [isAuthenticated, user]);
  
    const handleSurveyAnswers = (e) => {
      const { name, value } = e.target;
      setSurveyAnswers((prevAnswers) => ({
        ...prevAnswers,
        [name]: value,
      }));
    };
  
    const handleSubmitSurvey = async () => {
      try {
        setIsSubmitting(true);
        const surveyData = {
          user: user._id,
          situation: surveyAnswers.situation,
          hardestStep: surveyAnswers.hardestStep,
          solveTime: surveyAnswers.solveTime,
        };
  
        await createSurvey(surveyData);
        setShowSurvey(false);
        setIsSubmitting(false);
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    };
  
    const handleClose = () => {
      if (!isSubmitting && (!surveyAnswers.situation || !surveyAnswers.hardestStep || !surveyAnswers.solveTime)) {
        alert('Debe completar todas las preguntas antes de cerrar la encuesta.');
      } else {
        setShowSurvey(false);
      }
    };
  
    return (
      <>
        {isAuthenticated && showSurvey && (
          <div>
            <h2>Encuesta semanal</h2>
            <p>¿Cuál es tu situación con el cubo de Rubik?</p>
            <div>
              <input
                type="radio"
                name="situation"
                value="beginner"
                checked={surveyAnswers.situation === 'beginner'}
                onChange={handleSurveyAnswers}
              />
              <label>Se resolver el cubo (método principiante)</label>
            </div>
            <div>
              <input
                type="radio"
                name="situation"
                value="advanced"
                checked={surveyAnswers.situation === 'advanced'}
                onChange={handleSurveyAnswers}
              />
              <label>Se resolver el cubo (método avanzado)</label>
            </div>
            <div>
              <input
                type="radio"
                name="situation"
                value="cant-solve"
                checked={surveyAnswers.situation === 'cant-solve'}
                onChange={handleSurveyAnswers}
              />
              <label>No se resolver el cubo</label>
            </div>
  
            <p>¿Cuál es el paso en el cual te tardas más?</p>
            <div>
              <input
                type="radio"
                name="hardestStep"
                value="oll"
                checked={surveyAnswers.hardestStep === 'oll'}
                onChange={handleSurveyAnswers}
              />
              <label>OLL</label>
            </div>
            <div>
              <input
                type="radio"
                name="hardestStep"
                value="pll"
                checked={surveyAnswers.hardestStep === 'pll'}
                onChange={handleSurveyAnswers}
              />
              <label>PLL</label>
            </div>
            <div>
              <input
                type="radio"
                name="hardestStep"
                value="f2l"
                checked={surveyAnswers.hardestStep === 'f2l'}
                onChange={handleSurveyAnswers}
              />
              <label>F2L</label>
            </div>
  
            <p>¿Cuánto tardas en resolver el cubo de Rubik?</p>
            <div>
              <input
                type="radio"
                name="solveTime"
                value="5-30"
                checked={surveyAnswers.solveTime === '5-30'}
                onChange={handleSurveyAnswers}
              />
              <label>5-30 Segundos</label>
            </div>
            <div>
              <input
                type="radio"
                name="solveTime"
                value="31-59"
                checked={surveyAnswers.solveTime === '31-59'}
                onChange={handleSurveyAnswers}
              />
              <label>31-59 Segundos</label>
            </div>
            <div>
              <input
                type="radio"
                name="solveTime"
                value="60-120"
                checked={surveyAnswers.solveTime === '60-120'}
                onChange={handleSurveyAnswers}
              />
              <label>60-120 Segundos</label>
            </div>
  
            <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
            <button onClick={handleClose}>Cerrar</button>
          </div>
        )}
      </>
    );
  };
  
  export default Encuesta;