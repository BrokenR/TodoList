import React, {useEffect, useState} from 'react';
import List from "../List";
import close from '../../assets/close.svg'

import './AddListButton.scss'
import Badge from "../Badge";
import axios from "axios";

const AddList = ({colors, onAdd}) => {
    const [visiblePopup, setVisiblePopup] = useState(false)
    const [selectedColor, selectColor] = useState(3)
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        if(Array.isArray(colors)){
            selectColor(colors[0].id)
        }
    },[colors])

    const onClose=()=>{
        setInputValue('')
        setVisiblePopup(false)
        selectColor(colors[0].id)
    }
    const addList=()=>{
        if(!inputValue){
            alert("Название еп")
            return
        }
        setIsLoading(true)
        axios
            .post('https://todolist-react-drab.vercel.app/lists',{name:inputValue, colorId:selectedColor})
            .then(({data})=>{
                const color = colors.filter(c=>c.id===selectedColor)[0]
                const listObj={...data, color, tasks: []}
                onAdd(listObj)
                onClose()

        }).catch(()=>{alert("не вышло")})
            .finally(()=>{setIsLoading(false)})
    }

    return (
        <div className='add-list'>
        < List
            onClick={()=>setVisiblePopup(true)}
        items={[
            {
                className:'list__add-button',
                icon: (<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="12px" height="12px" ><path  d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"/></svg>),
                name:'Добавить список',
            }
            ]} />
            {visiblePopup && <div className="add-list__popup">
                <img onClick={onClose} src={close} alt='close-btn' className="add-list__popup-close-btn"/>
                <input value={inputValue} onChange={e=>setInputValue(e.target.value)} className='field' type="text" placeholder='Название папки'/>
                <div className="add-list__popup-colors">

                    {colors.map(color=>( <Badge
                        onClick = {()=>selectColor(color.id)}
                        color={color.name}
                        key={color.id}
                        className={selectedColor===color.id && 'active'} />))}


                </div>
                <button onClick={addList} className='button'>{isLoading?"Добавление":'Добавить'}</button>
            </div>}
        </div>
    );
};

export default AddList;
