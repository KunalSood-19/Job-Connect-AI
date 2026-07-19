import { useResume } from "@/context/ResumeContext";

export default function ProjectsForm(){

const {resume,setResume}=useResume();

const project=resume.projects[0]||{
title:"",
description:"",
github:"",
demo:""
};

const update=(field:string,value:string)=>{
setResume({
...resume,
projects:[
{
...project,
[field]:value
}
]
});
};

return(

<div className="space-y-3 border rounded-xl p-5">

<h2 className="text-xl font-bold">
Projects
</h2>

<input
placeholder="Project Title"
className="w-full border rounded-lg p-3"
value={project.title}
onChange={(e)=>update("title",e.target.value)}
/>

<textarea
rows={4}
placeholder="Description"
className="w-full border rounded-lg p-3"
value={project.description}
onChange={(e)=>update("description",e.target.value)}
/>

<input
placeholder="Github Link"
className="w-full border rounded-lg p-3"
value={project.github}
onChange={(e)=>update("github",e.target.value)}
/>

<input
placeholder="Live Demo"
className="w-full border rounded-lg p-3"
value={project.demo}
onChange={(e)=>update("demo",e.target.value)}
/>

</div>

);

}