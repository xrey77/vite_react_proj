import { useState } from "react";
import axios from 'axios';

const api = axios.create({
  baseURL: "https://localhost:7292",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})

export default function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitRegistration = (event: any) => {
    event.preventDefault();
    setMessage('please wait...');
    const data =JSON.stringify({ lastname: lastname, firstname: firstname,email: email, mobile: mobile,
      username: username, password: password });
    api.post("/signup", data)
    .then((res) => {
        if (res.data.statuscode === 200) {
          setMessage(res.data.message);
            return;
        } else {
          setMessage(res.data.message);
          window.setTimeout(() => {
            setMessage('');
          }, 3000);
          return;
        }
      }, (error) => {
        setMessage(error.message);
            window.setTimeout(() => {
              setMessage('');
            }, 3000);
          return;
    });    
  }

  const closeRegistration = (event: any) => {
    event.preventDefault();
    setFirstname('');
    setLastname('');
    setEmail('');
    setMobile('');
    setUsername('');
    setPassword('');
    setMessage('');
  }

  return (
    <div className="modal fade" id="staticRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticRegisterLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h1 className="modal-title fs-5 text-white" id="staticRegisterLabel">Account Registration</h1>
            <button onClick={closeRegistration} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={submitRegistration} autoComplete="off">
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <input type="text" required value={firstname} onChange={e => setFirstname(e.target.value)} className="form-control" id="fname" placeholder="enter First Name"/>
                  </div>          
                </div>
                <div className="col">
                  <div className="mb-3">
                    <input type="text" required value={lastname} onChange={e => setLastname(e.target.value)} className="form-control" id="lname" placeholder="enter Last Name"/>
                  </div>          
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <input type="emai" required value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="email" placeholder="enter Email Address"/>
                  </div>          
                </div>
                <div className="col">
                  <div className="mb-3">
                    <input type="text" required value={mobile} onChange={e => setMessage(e.target.value)} className="form-control" id="mobile" placeholder="enter Mobile No."/>
                  </div>          
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="form-control" id="uname" placeholder="enter Username"/>
                  </div>          
                </div>
                <div className="col">
                  <div className="mb-3">
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="pword" placeholder="enter Password"/>
                  </div>          
                </div>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-danger mx-2">register</button>
                <button onClick={closeRegistration} type="reset" className="btn btn-danger">reset</button>
              </div>
          </form>

          </div>
          <div className="modal-footer">
            <div className="w-100 text-center text-danger">{message}</div>
          </div>
        </div>
      </div>
    </div>            
  );  
}
