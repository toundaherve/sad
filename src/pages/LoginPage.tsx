import React, { useState } from "react"
import { useForm } from "react-hook-form"
import useFetch from "use-http"
import { Button, Input } from "reactstrap"
import { Link, useHistory } from "react-router-dom"

const apiAddress = "http://192.168.1.69:8001"

function LoginPage() {
    const history = useHistory()
    const {formState, register, trigger, getValues, handleSubmit} = useForm()
    const [requestSent, setRequestSent] = useState(false)
    const [matched, setMatched] = useState(false)
    const { post, loading, response } = useFetch(apiAddress);

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as keyof Account;
        trigger(name)
    }

    async function onSubmit(e: React.FormEvent<HTMLButtonElement>) {
        const data : {match: Boolean} = await post("/api/users/login",  getValues());
        if (!response.ok) {
          alert("There is a problem... Retry later!")
          return;
        }
        setRequestSent(true)
        if (!data.match) {
            setMatched(false)
            return
        } 
        history.push("/timeline")
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="mx-auto d-flex flex-column w-100" style={{maxWidth: "400px", marginTop: "20px"}}>
                <div className="d-flex flex-column align-items-stretch">
                    <div className="d-flex flex-column align-items-stretch mx-3">
                        <div className="d-flex flex-column">
                            <Link to="/"><span className="d-inline-block bg-primary" style={{width: "40px", height: "40px"}}></span></Link>
                            <h1 className="h1 mt-4" style={{marginBottom: "12px"}}>Log in to Twitter</h1>
                            {requestSent && !matched && <div className="alert alert-danger px-3 mb-0" role="alert">
                                The email and password you entered did not match our records. Please double-check and try again.
                            </div>}
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-stretch">
                       <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-flex flex-column align-items-stretch">
                            <div className="d-flex flex-column align-items-stretch px-3" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                                <Input placeholder="Email" type="email" name="email" onChange={handleChange} innerRef={register({required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,})} />
                            </div>
                            <div className="d-flex flex-column align-items-stretch px-3" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                                <Input placeholder="Password" type="password" name="password" onChange={handleChange} innerRef={register({ required: true })} />
                            </div>
                            <div className="d-flex flex-column align-items-stretch" style={{padding: "12px"}}>
                                <Button type="submit" disabled={!formState.isValid}>Log in</Button>
                            </div>
                        </div>
                       </form>
                    </div>
                    <div className="d-flex flex-column align-items-stretch">
                        <div className="d-flex flex-column mx-3">
                            <div className="d-flex justify-content-center" style={{marginTop: "20px"}}>
                                <span><a href="#1"><span>Forgot password?</span></a></span>
                                <span className="px-1"><a href="#1"><span>.</span></a></span>
                                <span><a href="#1"><span>Sign up for Twitter</span></a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage