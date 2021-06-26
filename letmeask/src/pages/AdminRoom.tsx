
import {useHistory, useParams} from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import Modal from 'react-modal'

import {Button} from '../components/Button';
import { Question } from '../components/Question';
import {RoomCode} from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';



type RoomParams ={
    id: string;
}

export function AdminRoom(){

    const history =  useHistory()
    const params = useParams<RoomParams>();
    const roomId =  params.id;
    const { theme, toggleTheme } = useTheme();
    
    const [isModalVisible, setIsModalVisible] = useState(false);  

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
            setIsModalVisible(false);
        }

    function openModal(){
        setIsModalVisible(true);
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
        
    }

    async function handleHighlightQuestion (questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
        
    }
   
    return(
        <div id ='page-room' className={theme}>
            <header>
                <div className ='content'>
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                    <RoomCode code={roomId} />
                    <Button isOutlined onClick ={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className='content'>
                <div className='room-title'>
                    <button className='themeButton' onClick ={toggleTheme} >{theme}</button>
                    <h1>Sala {title} </h1>
                   {questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
                </div>

               
             <div className="question-list">
             { //use map para renderizar componentes
              questions.map((question) =>{
                  return(
                      <Question 
                      //key algoritimo de reconciliação
                      key ={question.id}
                      content ={question.content}
                      author = {question.author}
                      isAnswered = {question.isAnswered}
                      isHighlighted = {question.isHighlighted}
                      >
                         {!question.isAnswered && (
                             <>
                              <button
                              type ="button"
                              onClick = {() => handleCheckQuestionAsAnswered(question.id)}
                              >
                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                              </button>

                              <button
                              type ="button"
                              onClick = {() => handleHighlightQuestion(question.id)}
                              >
                                <img src={answerImg} alt="Dar destaque a pergunta" />
                              </button>
                              </>
                         )}
                         <button
                              type ="button"
                              onClick = {() => openModal()}
                              >
                                <img src={deleteImg} alt="Remover pergunta" />
                              </button>   
                              <Modal style =
                              {{  overlay: {
                               
                             
                                backgroundColor: 'rgba(0,0,0,0)'
                              },
                              content: {
                                position: 'absolute',
                                width: 300,
                                height: 200,
                                border: 'none',
                                boxShadow: '2px 2px 20px 2px #835afd55',
                                background: '#9999ff55',
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '10px',
                                outline: 'none',
                                padding: '20px'
                              }
                                }}
                                isOpen = {isModalVisible} onRequestClose = {() => setIsModalVisible(false)}>
                                    <strong>Tem certeza que deseja excluir esta pergunta?</strong> <br />
                                 <br />
                                 <hr />
                                 <div className='buttons'>
                                 <button className='button-color' onClick = { () => handleDeleteQuestion(question.id)} >SIM
                                 </button>
                                 <button className='button-color' onClick = { () => setIsModalVisible(false)} >NÂO</button>
                                </div>
                             </Modal>        

                      </Question>
                  )
              } 
              )}
             </div>
            
            </main>
        </div>
    )
}

