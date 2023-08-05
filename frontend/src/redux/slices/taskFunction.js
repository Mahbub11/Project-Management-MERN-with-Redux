import { createSlice, current } from '@reduxjs/toolkit';
export const TaskData =(modifyTask,projects)=>{

         const requestedTask=(JSON.parse(JSON.stringify(modifyTask)))
         console.log(requestedTask)

     // const data= projects.find((project)=> project._id === requestedTask[0].id);
     //  const serverData=(JSON.parse(JSON.stringify(data.task)));
      
      const finalReport = projects.map(projects => {

          const p={...projects}

         const findOne= projects.task.filter(task=> task._id=== modifyTask[0].taskId)


      }
         

          )
     
        
        console.log(JSON.parse(JSON.stringify(finalReport))) // <== your desired array


}