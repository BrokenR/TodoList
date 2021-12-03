import React, {useState} from 'react';
import add from "../../assets/add.svg";
import axios from "axios";

const AddTaskForm = ({list, onAddTask}) => {
const [visibleForm, setFormVisible] = useState(false)
const [inputValue, setInputValue] = useState('')
const [isLoading,setIsLoading] = useState('')
const toggleFormVisible = ()=>{
    setFormVisible(!visibleForm)
}
const closeForm = ()=>{
 setFormVisible(false)
 setInputValue('')
}
const addTask =()=>{const obj = {
    "listId":list.id,
    "text":inputValue,
    "completed":false
}
    setIsLoading(true)
     axios.post('/tasks', obj).then(({data})=>{

         onAddTask(list.id,data )
         closeForm()
    }).catch(()=>{alert("не вышло")})
         .finally(()=>setIsLoading(false))


}

    return (
        <div className="tasks__form" >
            {!visibleForm?
                <div className="tasks__form-new" onClick={toggleFormVisible}>
                    <img src={add} alt="add"/>
                    <span>Новая задача</span>
                </div>
            :
                <div className="tasks__form-block">
                    <input
                        autoFocus
                        value={inputValue}
                        onChange={(e)=>{setInputValue(e.target.value)}}
                        className='field'
                        type="text"
                        placeholder='Текст задачи'/>
                    <button disabled={isLoading} onClick={addTask} className='button'>{isLoading ? 'Добавляю':'Добавить'}</button>
                    <button onClick={closeForm} className='button button--grey'>Отмена</button>
                </div>
            }
        </div>
    );
};

export default AddTaskForm;
