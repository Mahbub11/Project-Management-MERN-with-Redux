import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from './BtnPrimary'
import DropdownMenu from "./DropdownMenu";
// import TaskModal from "./TaskModal";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown"
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";
import Switcher from "./Switcher";
import { useDispatch, useSelector } from "react-redux";
import {ToggleBlury} from '../redux/actions/index'
import { SaveDragged } from "../redux/slices/task";



function Task() {

    const { projectId } = useParams();
    const [search,setSearch]= useState(); 
     const dispatch= useDispatch();
    // const[res,setRes]= useState();
    const {tasks}= useSelector((state)=>state.tasks)
    console.log(tasks)


        const [isAddTaskModalOpen, setAddTaskModal] = useState(false);

        // const [columns, setColumns] = useState(columnsFromBackend);
        const [columns, setColumns] = useState({});
        const [isRenderChange, setRenderChange] = useState(false);
        const [isTaskOpen, setTaskOpen] = useState(false);
        const [taskId, setTaskId] = useState(false);
        const [title, setTitle] = useState('');
        const navigate = useNavigate();
    
                const res=((tasks.filter((task)=>task._id === projectId)));                                                                                                                                                                                                                                                   
      useEffect(() => {
     
   
        if (!isAddTaskModalOpen || isRenderChange) {
                    setTitle(res[0].title)
                    setColumns({
                        [uuid()]: {
                            name: "Requested",
                            items: res[0].task.filter((task) => task.stage === "Requested").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "To do",
                            items: res[0].task.filter((task) => task.stage === "To do").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "In Progress",
                            items: res[0].task.filter((task) => task.stage === "In Progress").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "Done",
                            items: res[0].task.filter((task) => task.stage === "Done").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        
                    })
                    setRenderChange(false)
                // }).catch((error) => {
                //     toast.error('Something went wrong')
                // })
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);     
    


    // comapre between destination source
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let data = {}
        // processed source destination index check
        if (source.droppableId !== destination.droppableId) {

            // Let's find out the source and destination column and items
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
             // remove the items from source index and put 1
            const [removed] = sourceItems.splice(source.index, 1);
            // add the removed item in destination index and put 0
            destItems.splice(destination.index, 0, removed);

            setColumns({
                //primary column
                ...columns,
                // over write the primary data
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                // overwrite the source data
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            
            data = {
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            }
   
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            // remove the item and put 1
            const [removed] = copiedItems.splice(source.index, 1);
            // put the remve item in destination
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            }

        }
        console.log(data)
        dispatch(SaveDragged(data,projectId))

        
        updateTodo(data)
    };

  

    const updateTodo = (data) => {
        axios.put(`http://localhost:9000/project/${projectId}/todo`, data)
            .then((res) => {
            }).catch((error) => {
                toast.error('Something went wrong')
            })
    }

    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        axios.delete(`http://localhost:9000/project/${projectId}/task/${taskId}`)
            .then((res) => {
                toast.success('Task is deleted')
                setRenderChange(true)
            }).catch((error) => {

                toast.error('Something went wrong')
            })
    }

    const handleTaskDetails = (id) => {
        setTaskId({ projectId, id });
        setTaskOpen(true);
        dispatch(ToggleBlury())
    }

    return (
        <div className='px-12 py-6 w-full'>
            
            <div className="flex items-center justify-between mb-6">
                <h1 className='text-xl text-gray-800 flex justify-start items-center space-x-2.5'>
                    <span className="dark:text-white">{title.slice(0, 25)}{title.length > 25 && '...'}</span>
                    <ProjectDropdown id={projectId} navigate={navigate} />
                    <div className="w-[50rem] h-15 p-2 mr-5 rounded-sm ">
                        <input className="dark:bg-indigo-400/20 rounded-sm w-full shadow-sm dark:text-white text-center"
                        placeholder="Search Task" onChange={(e)=> setSearch(e.target.value)}></input>
                                        </div>
                </h1>
                <BtnPrimary onClick={() => setAddTaskModal(true)}>Add todo</BtnPrimary>
            </div>
            <DragDropContext
                onDragEnd={result => onDragEnd(result)}
               >
                <div className="flex gap-5">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div
                                className="w-3/12 h-[580px]"
                                key={columnId}
                            >
                                <div className="pb-2.5 w-full flex justify-between">
                                    <div className="inline-flex items-center space-x-2">
                                        <h2 className=" text-[#1e293b] dark:text-white font-medium text-sm uppercase leading-3">{column.name}</h2>
                                        <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-md dark:text-white font-semibold text-gray-500 border border-gray-300 dark:border-white ${column.items.length < 1 && 'invisible'}`}>{column.items?.length}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={15} className="text-[#9ba8bc] dark:text-white" viewBox="0 0 448 512"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" /></svg>
                                </div>
                                <div>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 dark:border-white ${snapshot.isDraggingOver && 'border-indigo-600'}`}
                                              >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item._id}
                                                                draggableId={item._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{ ...provided.draggableProps.style }}
                                                                            onClick={() => handleTaskDetails(item._id)}
                                                                              className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 dark:border-none rounded-lg shadow-sm dark:bg-indigo-200/20 relative ${snapshot.isDragging && 'shadow-md'}`}
                                                                        >
                                                                            <div className="pb-2">
                                                                                <div className="flex item-center justify-between">
                                                                                    <h3 className="text-[#1e293b] dark:text-white text-xl font-thin capitalize">{item.title.slice(0, 22)}{item.title.length > 22 && '...'}</h3>
                                                                                    <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} />
                                                                                </div>
                                                                                <p className="text-sm text-slate-500 dark:text-gray-100 leading-4 font-thin -tracking-tight">{item.description.slice(0, 60)}{item.description.length > 60 && '...'}</p>
                                                                                <span className="py-1 px-2.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium mt-1 inline-block">Task-{item.index}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>

                                </div>
                            </div>
                        );
                    })}
                </div >
            </DragDropContext >
            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} />
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
        </div >
    );
}

export default Task;