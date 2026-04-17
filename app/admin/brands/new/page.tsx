"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBrandPage() {

  const router = useRouter();
  const [name,setName] = useState("");

  async function createBrand(){

    if(!name) return;

    await fetch("/api/admin/brands",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ name })
    });

    router.push("/admin/brands");
  }

  return (

    <div style={{maxWidth:"600px",margin:"40px auto"}}>

      <h1 style={{fontSize:"24px",fontWeight:"bold",marginBottom:"20px"}}>
        Add Brand
      </h1>

      <div style={{display:"flex",gap:"10px"}}>

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Brand name"
        />

        <button onClick={createBrand}>
          Save
        </button>

      </div>

    </div>
  );
}