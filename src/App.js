import React, {useState, useEffect} from "react";
import axios from "axios";
import {Route, Routes, useLocation} from 'react-router-dom'
import {useNavigate} from "react-router-dom";


import {List, AddList, Tasks} from './components'


function App() {
    const [lists, setLists] = useState(null)
    const [colors, setColors] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    let history = useNavigate();
    let location = useLocation()
    console.log(location)

useEffect(()=>{
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data })=>{
        setLists(data)
    })
    axios.get('http://localhost:3001/colors').then(({ data })=>{
        setColors(data)
    })
}, [])
    const onAddList =(obj)=>{
        const newList=[...lists, obj]
        setLists(newList)
    }
    const onAddTask =(listId, taskObj)=>{
        const newList = lists.map(item=>{
            if(item.id===listId){
                item.tasks=[...item.tasks, taskObj]
            }
            return item
        })
        setLists(newList)
    }

    const onEditListTitle = (id,title)=>{
        const newList=lists.map(item=>{
            if(item.id===id){
                item.name=title
            }
            return item
        })
        setLists(newList)
    }

    const onRemoveTask=(listId, taskId)=>{
        if(window.confirm('Реально?')){
           const newList = lists.map(item=>{
               if(item.id===listId){
                   item.tasks = item.tasks.filter(task=>task.id!==taskId)
               }
               return item
           })
            setLists(newList)
            axios.delete('http://localhost:3001/tasks/'+taskId,{
            }).catch(()=>{
                alert("все хуйня")})
        }
    }
    const onEditTask=(listId, inputValue,setTextValue,taskId)=> {
        if (inputValue) {
            const newList = lists.map(item => {
                if (item.id === listId) {
                    item.tasks.text = inputValue
                }
                return item
            })
            setLists(newList)
            axios.patch('http://localhost:3001/tasks/' + taskId, {text: inputValue}).catch(() => alert('НЕА'))
        } else {
            alert("Введи чото")
        }
    }

    const onCompleteTask =(listId, taskId, completed)=>{
        const newList = lists.map(item=>{
            if(item.id===listId){
                item.tasks= item.tasks.map(task=>{
                    if(task.id===taskId){
                        task.completed=completed
                    }
                    return task
                })
            }
            return item
        })
        setLists(newList)
        axios
            .patch('http://localhost:3001/tasks/'+taskId,{
                completed
            }).catch(()=>alert(123))
    }

useEffect(()=>{
    const listId=location.pathname.split('lists/')[1]
    if(lists){
        const list = lists.find(list=>list.id===Number(listId))
        setActiveItem(list)
    }
},[lists, location.pathname])
  return (
      <div className='todo'>
        <div className="todo__sidebar">
          <  List
              onClickItem={item=>{
                  history(`/`)
              }}
              items={[
                {
                    active: location.pathname==='/',
                    icon:(
                        <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="18px" height="18px"><path d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z"/></svg>),
                    name:'Все задачи'
                }
            ]}/>
            {lists ? (
                <List
                    items={lists}
                    onRemove={(id)=>{
                        const newLists= lists.filter((item)=>item.id!==id)
                        setLists(newLists)
                    }}
                    onClickItem={item=>{
                        history(`/lists/${item.id}`)
                    }}
                    activeItem = {activeItem}
                    isRemovable/>
                ):(
                    'Загрузка...'
                )}
            <AddList onAdd={onAddList} colors = {colors} />
        </div>
          <div className="todo__tasks">
              <Routes>

                      <Route path='/lists/:id' element={lists&&activeItem&& (
                          <Tasks
                              onCompleteTask={onCompleteTask}
                              key={activeItem.id}
                             onAddTask={onAddTask}
                            onEditTitle={onEditListTitle}
                              onRemoveTask={onRemoveTask}
                              onEditTask={onEditTask}
                          list={activeItem}/>)
                      }
                      />
                      <Route exact path='/' element={lists&&
                      lists.map(list=>(
                          <Tasks

                              key={list.id}
                              onAddTask={onAddTask}
                              onEditTitle={onEditListTitle}
                              onRemoveTask={onRemoveTask}
                              onEditTask={onEditTask}
                              onComplete={onCompleteTask}
                              list={list}
                              withoutEmpty
                          />
                      ))}/>

                  </Routes>
          </div>
      </div>
  );
}

export default App;
