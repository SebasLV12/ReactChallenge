import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import  {UsersList}  from './components/UsersList'
import { SortBy, type User} from './types.d';

function App() {
  const [users,setUsers]=useState<User[]>([]);
  const [showColors,setShowColors]=useState(false);
  const [sorting,setSorting]=useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry]= useState<string|null>(null)
  const originalUsers= useRef<User[]>([])


  const toggleColors = ()=>{
    setShowColors(!showColors)
  }
  const toggleSortByCountry=()=>{
    const newSortingValue=sorting===SortBy.NONE?SortBy.COUNTRY :SortBy.NONE
    setSorting(newSortingValue)
  }
  const handleDelete = (email:string)=>{
    const filteredUsers=users.filter((user)=>user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort=(sort: SortBy)=>{
    setSorting(sort)
  }
  const handleReset=()=>{
    setUsers(originalUsers.current)
  }

  useEffect(()=>{
    fetch('https://randomuser.me/api?results=100')
    .then(async res=>await res.json())
    .then(res=>{
        setUsers(res.results)
        originalUsers.current=res.results
    })
    .catch(err=>{
      console.error(err)
    }) 
  },[])



  const filteredUsers= useMemo(()=>{
   
    return filterCountry !== null && filterCountry.length>0
    ? users.filter(user =>{
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    }) : users
  },[users,filterCountry])

  const sortedUsers=useMemo(()=>{

    if(sorting===SortBy.NONE) return filteredUsers

    const compareProperties:Record<string,(user:User)=>any>={
      [SortBy.COUNTRY]: user =>user.location.country,
      [SortBy.NAME]: user =>user.name.first,
      [SortBy.LAST]: user =>user.name.last,
    }

    return filteredUsers.toSorted((a,b)=>{
      const extracProperty=compareProperties[sorting]
      return extracProperty(a).localeCompare(extracProperty(b))
    })
  },[filteredUsers,sorting])
  return (
    <>
      <h1>Prueba Tecnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={toggleSortByCountry}>
          {sorting===SortBy.COUNTRY?'No ordenar por país':'Ordenar País'}
        </button>
        <button onClick={handleReset} >
          Resetear usuarios
        </button>
        <input placeholder='Filtra por país' onChange={(e)=>{
          setFilterCountry(e.target.value)
        }}></input>
      </header>
      <main>
        <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete}  showColors={showColors}  users={sortedUsers}/>
      </main>
    </>
  )
}

export default App
