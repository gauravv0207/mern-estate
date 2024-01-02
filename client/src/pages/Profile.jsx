import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
        getDownloadURL, 
        getStorage, 
        ref, 
        uploadBytesResumable
      } 
      from 'firebase/storage';
import { app } from "../firebase";

import {  
          updateUserStart,
          updateUserSuccess,
          updateUserFailure,
          deleteUserStart,
          deleteUserSuccess,
          deleteUserFailure
        } from "../redux/user/userSlice";
import { set } from "mongoose";

export default function Profile() {
  const fileRef=useRef(null)
  const {currentUser,loading,error}=useSelector((state)=>state.user)
  const [file,setfile]=useState(undefined);
  const [filePerc,setfilePerc]=useState(0);
  const [fileUploadError,setfileUploadError]=useState(false);
  const [formData,setformData]=useState({});
  const [updateSuccess, setUpdateSuccess]=useState(false);
  // console.log(formData);
  const dispatch=useDispatch()
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef =ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred /snapshot.totalBytes)*100;
          // console.log('Upload is '+ progress + '% done');
          setfilePerc(Math.round(progress));
        },

        (error)=>{
          setfileUploadError(true)
        },

        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).
          then((downloadUrl)=>{
            setformData({...formData, avatar:downloadUrl})
          })
        }
    );
  }

  const handleChange=(e)=>{
    setformData({...formData,[e.target.id]:e.target.value})
  }

  // const handleSubmit= async (e)=>{
  //   e.preventDefault();
  //   try {
  //     dispatch(updateUserStart())
  //     const res= await fetch(`/api/user/update/${currentUser._id}`,{
  //       method:'POST',
  //       headers:{
  //         'Content-Type':'application/json'
  //       },
  //       body:JSON.stringify(formData)
  //     })
  //     console.log(res);
  //     const data=await res.json();
  //     console.log(data);
  //     // if (data.status===false) {
  //     //   dispatch(updateUserFailure(data.message));
  //     //   return;
  //     // }
  //     console.log("dispatched succesfullly");
  //     dispatch(updateUserSuccess(data));
  //   } catch (error) {
  //     console.log("there was a error",error.message);
  //     dispatch(updateUserFailure(error.message))
  //   }
  // }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    // if (data.success === true) {
    // if (data.status === false) {
    if (res.ok === false) {
      console.log("there was an error");
      setUpdateSuccess(false);
      dispatch(updateUserFailure(data.message));
      return;
    }
    console.log("dispatched successfully");
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } 
  catch (error) {
    console.log("there was an error", error.message);
    dispatch(updateUserFailure(error.message));
  }
};

const handleDeleteUser = async ()=>{
  try {
    dispatch(deleteUserStart())
    const res = await fetch(`api/user/delete/${currentUser._id}`,{
      method: 'DELETE'
  });
  const data = await res.json();
  if(data.success===false){
    dispatch(deleteUserFailure(data.message))
    return;
  }
  dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          onChange={(e)=>setfile(e.target.files[0])} 
          type="file" 
          ref={fileRef}
          hidden 
          accept="image/*"
          />

        <img src={ formData.avatar || currentUser.avatar} 
        onClick={()=>fileRef.current.click()} 
        alt="profile" 
        className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">{
        fileUploadError ? 
          (<span className="text-red-700">Error Image Upload(Image must be less than 2 mb)</span>)
              :
         filePerc > 0  && filePerc<100 ? (
          <span className="text-slate-700">
            {`Uploading ${filePerc}%`}
          </span>
        ) 
           :
        filePerc===100 ?(
          <span className="text-green-700">
            Successfully uploaded
          </span>
        )
         : 
         ""

         }</p>

        <input 
          type="text" 
          name="" 
          id="username" 
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input 
          type="email" 
          name="" 
          id="email" 
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
          />

        <input 
          type="password" 
          name="" 
          id="passsword" 
          placeholder="passsword"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          />
          
        <button 
        disabled={loading}
        className="bg-slate-700 text-white rounded-lg p-3 
        uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Updating...':'Update'}</button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer ">Delete account</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">  {error ? error :""}</p>
      <p className="text-green-700 mt-5">  {updateSuccess ? "User updated Succesfully!":""}</p>
    </div>
  )
}





//firebase storage rules
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')