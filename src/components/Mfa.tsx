import { useEffect, useState } from "react"
import jQuery from "jquery";
import axios from 'axios';

const api = axios.create({
   baseURL: "https://localhost:7292",
   headers: {'Accept': 'application/json',
             'Content-Type': 'application/json'}
})

export default function Mfa() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [userid, setUserid] = useState('');

  useEffect(() => {
    const uid = sessionStorage.getItem('USERID');
    if (uid !== null) {
      setUserid(uid);
    }
  },[userid]);

  const submitMfa = (event: any) => {
    event.preventDefault();
    setMessage('please wait..');
    const data =JSON.stringify({ id: userid, otp: otp });
    api.post("/validateotp", data)
    .then((res) => {
        if (res.data.statuscode === 200) {
          setMessage(res.data.message);
            sessionStorage.setItem("USERNAME", res.data.username);
            window.setTimeout(() => {
              setMessage('');
              jQuery("#mfaReset").trigger('click');
              window.location.reload();
            }, 3000);
            return;
        } else {
          setMessage(res.data.message);
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

  const closeMfa = (event: any) => {
    event.preventDefault();
    setMessage('');
    setOtp('');
    sessionStorage.removeItem('USERID');
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('USERPIC');
    sessionStorage.removeItem('TOKEN');
    location.reload();
  }

  return (
    <div className="modal fade" id="staticMfa" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticMfaLabel" aria-hidden="true">
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-info">
            <h1 className="modal-title fs-5 text-white" id="staticMfaLabel">Multi-Factor Authenticator</h1>
            <button onClick={closeMfa} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <form onSubmit={submitMfa} autoComplete="off">
            <div className="mb-3">
              <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="form-control" id="otp" placeholder="enter 6-digin OTP code"/>
            </div>          
            <div className="mb-3">
              <button type="submit" className="btn btn-info mx-2 text-white">submit</button>
              <button onClick={closeMfa} type="reset" className="btn btn-info text-white">reset</button>
            </div>
          </form>            
          </div>
          <div className="modal-footer">
            <div className="w-100 text-center text-danger">{message}</div>
          </div>
        </div>
      </div>
    </div>    
  )
}
        
