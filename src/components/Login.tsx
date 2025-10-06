import { useState } from "react";
import Mfa from "./Mfa";
import jQuery from "jquery";
import axios from 'axios';

const api = axios.create({
  baseURL: "https://localhost:7292",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})

interface User {
  statuscode: string,
  message: string,
  id: string,
  lastname: string,
  firstname: string,
  username: string,
  roles: string,
  isactivated: number,
  isblocked: number,
  profilepic: string,
  qrcodeurl: string,
  token: string
}
export default function Login() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('')
   const [message, setMessage] = useState<string>('');
   const [isdiabled, setIsdisabled] = useState(false);

   const submitLogin = (event: any) => {
    event.preventDefault();
    setMessage('please wait...');
    setIsdisabled(true);
    const data =JSON.stringify({ username: username, password: password });
    api.post<User>("/signin", data)
    .then((res) => {
            const jsonData: User = res.data;
            setMessage(jsonData.message);
            if (jsonData.qrcodeurl != null) {
                window.sessionStorage.setItem('USERID',jsonData.id);
                window.sessionStorage.setItem('TOKEN',jsonData.token);
                window.sessionStorage.setItem('ROLE',jsonData.roles);
                window.sessionStorage.setItem('USERPIC',jsonData.profilepic);
                jQuery("#loginReset").trigger("click");
                jQuery("#mfaModal").trigger("click");
                setIsdisabled(false);
            } else {
                window.sessionStorage.setItem('USERID',jsonData.id);
                window.sessionStorage.setItem('USERNAME',jsonData.username);
                window.sessionStorage.setItem('TOKEN',jsonData.token);                        
                window.sessionStorage.setItem('ROLE',jsonData.roles);
                window.sessionStorage.setItem('USERPIC',jsonData.profilepic);
                setIsdisabled(false);
                jQuery("#loginReset").trigger('"click')
                closeLogin;
                location.reload();
            }
      }, (error: any) => {
            setMessage(error.response.data.message);
            setTimeout(() => {
              setMessage('');
              setIsdisabled(false);
            }, 3000);
            return;
    });    
  }

  const closeLogin = (event: any) => {
    event.preventDefault();
    setIsdisabled(false);    
    setMessage('');
    setUsername('');
    setPassword('');
  }

  return (
    <>
<div className="modal fade" id="staticLogin" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticLoginLabel" aria-hidden="true">
  <div className="modal-dialog modal-sm modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header bg-primary">
        <h1 className="modal-title text-white fs-5" id="staticLoginLabel">User's Login</h1>
        <button onClick={closeLogin} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={submitLogin} autoComplete="off">
        <div className="mb-3">
          <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="form-control" disabled={isdiabled} placeholder="enter Username"/>
        </div>          
        <div className="mb-3">
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="form-control" disabled={isdiabled} placeholder="enter Password"/>
        </div>          
        <div className="mb-3">
          <button type="submit" className="btn btn-primary mx-2" disabled={isdiabled}>login</button>
          <button id="loginReset" onClick={closeLogin} type="reset" className="btn btn-primary">reset</button>
          <button id="mfa" type="button" className="btn btn-warning d-none" data-bs-toggle="modal" data-bs-target="#staticMfa">mfa</button>

          </div>
        </form>
      </div>
      <div className="modal-footer">
        <div className="w-100 text-danger">{message}</div>
      </div>
    </div>
  </div>
</div>    
<Mfa/>
</>
  )
}
