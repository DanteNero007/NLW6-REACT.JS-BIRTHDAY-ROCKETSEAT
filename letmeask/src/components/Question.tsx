import {ReactNode} from 'react'
import '../styles/question.scss';
import cx from 'classnames';

type QuestionProps = {
    content: string;
    author:{
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    content,
    author,
    children,
    isAnswered = false,
    isHighlighted = false,
}:QuestionProps){
return(
    //{`question ${isAnswered ? 'answered': ''} ${isHighlighted ? 'highlighte': ''}`}
    <div className= {cx(
        'question', 
        {answered: isAnswered, },
        {highlighted: isHighlighted && !isAnswered},
    )}
    >
        <p> {content} </p>
        <br />
        <footer>
            <div className ="user-info">
                <img src={author.avatar} alt={author.name} />
                <span> {author.name} </span>
            </div>
            <div> {children} </div>
        </footer>
    </div>
);
}
