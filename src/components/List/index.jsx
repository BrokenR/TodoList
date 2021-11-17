import React from 'react';
import classNames from 'classnames'
import axios from "axios";

import './List.scss'
import Badge from "../Badge";
import remove from '../../assets/remove.svg'

const List = ({items, onClick, isRemovable, onRemove, onClickItem, activeItem}) => {
    const removeList=(item)=>{
        if(window.confirm('Точно?')){
            axios.delete('http://localhost:3001/lists/'+item.id).then(()=>{
                onRemove(item.id)
            })

        }
    }
    return (
        <ul className="list"
        onClick={onClick}>
            {items.map((item, index)=> (
                <li
                    key={index}
                    onClick={onClickItem? ()=>onClickItem(item):null}
                    className={classNames(item.className, {active:item.active? item.active:activeItem && activeItem.id ===item.id})}>
                    <i>
                        {item.icon?item.icon:<Badge color={item.color.name}/>}
                    </i>
                    <span>
                        {item.name}
                        {item.tasks && item.tasks.length>0&& ` (${item.tasks.length})`}
                    </span>
                    {isRemovable&&(<img className='list__remove-icon' src={remove} alt='remove' onClick= {()=>{removeList(item)}}/>)}
                </li>
            ))}
        </ul>
    );
};

export default List;
