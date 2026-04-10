import { useEffect, useRef, useState, type JSX } from "react";
import type { ICreateDocPopUp } from "../models";
import { axiosInstance } from "../axios";
// import { useFetchUsers } from "../api/hooks";


function CreateDocPopUp({
  isPopUpOpen,
  setIsPopUpOpen,
}: ICreateDocPopUp): JSX.Element {
  
  const [name, setName] = useState<string>("");
  // const [collabs, setCollabs] = useState<string[]>([]);
  // const[userData,setUsersData]=useState<IUser[]>([]);
//   const[selectedUser,setSelectedUser]=useState<IUser|undefined>(undefined)
  // const{data:users}=useFetchUsers()
  
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (isPopUpOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isPopUpOpen]);

  // useEffect(()=>{
  //   axiosInstance.get("/getUsers")
  //   .then(res=>{
  //       setUsersData(res.data.data)
  //       console.log(res.data)})
  //   .catch(err=>console.log(err))
  // },[])

  const handleClose = () => {
    setIsPopUpOpen(false);
  };

    function handleCreateDoc(){
        const payload={
            docName:name
        }
        axiosInstance.post("/createDoc",payload)
    }
    // console.log({collabs})

  return (
    <dialog ref={dialogRef} onClose={handleClose} className="overflow-visible bg-white text-black">
      <form method="dialog">
        <header>
          <h3>Edit form</h3>
        </header>

        <div className="vstack">
          <label>
            Document Name
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 rounded-md"
            />
          </label>

          {/* <label>
                      Collabarators 
                      <Autocomplete 
                          disablePortal
                          options={userData??[]}
                          getOptionLabel={(opt)=>opt?.userName}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Search User Name" />}
                          className="w-full! rounded-md!"
                      />
          </label> */}
          
        </div>

        <footer>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
          <button value="save" onClick={handleCreateDoc}>Create Doc</button>
        </footer>
      </form>
    </dialog>
  );
}

export default CreateDocPopUp;