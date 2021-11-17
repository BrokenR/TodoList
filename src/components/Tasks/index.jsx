import React from 'react';
import axios from "axios";


import './Tasks.scss'
import edit from '../../assets/edit.svg'

import {AddTaskForm} from "../../components";
import Task from "./Task";

const Tasks = ({list, onEditTitle, onAddTask, withoutEmpty,onRemoveTask, onEditTask, onCompleteTask}) => {

    const editTitle=()=>{
        const newTitle = window.prompt('Название', list.name)
        if(newTitle){
            onEditTitle(list.id,newTitle)
            axios.patch('http://localhost:3001/lists/'+list.id,{
                name:newTitle
            }).catch(()=>{
                alert("все хуйня")})
        }
    }


    return (
        <div className="tasks">
            <h2 style={{color:list.color.hex}} className="tasks__title ">
                {list.name}
                <img onClick={()=>editTitle(list.id, list.name)} src={edit} alt='edit'/>
            </h2>
            <div className="tasks__items">
                {!withoutEmpty &&list.tasks&& !list.tasks.length && list.tasks&& <h2>Задачи отсутствуют</h2>}
                {list.tasks&&list.tasks.map(task=><Task list={list} onEdit={onEditTask} onComplete={onCompleteTask} onRemove={onRemoveTask} key={task.id}{...task}/>)
                }
                <AddTaskForm key={list.id}list={list} onAddTask={onAddTask}/>
            </div>
        </div>
    );
};

export default Tasks;
