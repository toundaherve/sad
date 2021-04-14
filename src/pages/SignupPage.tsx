import React, {  ReactNode, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import useFetch from "use-http"
import { Link } from "react-router-dom"
import { Button, Input } from "reactstrap"

type Account = {
    name: string;
    email: string;
    country: string;
    city: string;
}

type Step = "account_creation" | "email_verification" | "password_creation"

function SignupPage() {
    const [visibleNextButton, setVisibleNextButton] = useState(false)
    const [visiblePreviousButton, setVisiblePreviousButton] = useState(false)
    const [disabledNextButton, setDisabledNextButton] = useState(true)
    const [disabledPreviousButton, setDisabledPreviousButton] = useState(false)
    const [currentStep, setCurrentStep] = useState<Step>("account_creation")
    const [account, setAccount] = useState<Account>({name: "", email: "", country: "", city: ""})
    const nextButtonRef = useRef(null) 

    function handleSuccessAccountCreation(account : Account) {
        setAccount(account)
        setCurrentStep("email_verification")
        setVisibleNextButton(true)
        setVisiblePreviousButton(true)
    }

    function handleSuccessEmailVerification() {
        setCurrentStep("password_creation")
        setDisabledNextButton(true)
        setVisiblePreviousButton(false)
    }

    function handlePreviousButtonClick() {
        if (currentStep === "email_verification") {
            setCurrentStep("account_creation")
            setVisiblePreviousButton(false)
            setVisibleNextButton(false)
        }
    }

    function alertError() {
      alert("Sorry, there is an error...")
    }

    return (
        <div className="d-flex flex-column align-items-stretch min-vh-100">
            <div className="d-flex flex-column align-items-stretch flex-grow-1 flex-shrink-0 mx-auto w-100" style={{maxWidth: "600px"}}>
                <div className="d-flex flex-column align-items-stretch flex-shrink-0" style={{height: "53px", zIndex: 2}}>
                    <div className="d-flex flex-column align-items-stretch w-100">
                        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white px-3">
                            <div className="d-flex align-items-center justify-content-center" style={{minHeight: "53px"}}>
                                <span className="d-flex flex-column justify-content-center flex-grow-1 flex-shrink-1 align-items-start align-self-stretch" style={{minWidth: "56px", minHeight: "32px", flexBasis: "50%"}}>
                                    {visiblePreviousButton && <Button disabled={disabledPreviousButton} onClick={handlePreviousButtonClick}>Previous</Button>}
                                </span>
                                <span><Link to="/">Logo</Link></span>
                                <span className="d-flex flex-column justify-content-center flex-grow-1 flex-shrink-1 align-items-end align-self-stretch" style={{minWidth: "56px", minHeight: "32px", flexBasis: "50%"}}>
                                    {visibleNextButton && <Button disabled={disabledNextButton} innerRef={nextButtonRef}>Next</Button>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
               {currentStep === "account_creation" && <AccountCreationForm onSuccessAccountCreation={handleSuccessAccountCreation} onError={alertError} />}
               {currentStep === "email_verification" && <EmailVerificationForm email={account.email} onValidCode={() => setDisabledNextButton(false)} onInvalidCode={() => setDisabledNextButton(true)} submitButtonRef={nextButtonRef} onSuccess={handleSuccessEmailVerification} />}
               {currentStep === "password_creation" && <PasswordCreationForm onValidPassword={() => setDisabledNextButton(false)} onInvalidPassword={() => setDisabledNextButton(true)} submitButtonRef={nextButtonRef} onSuccess={() => { alert("Done!!") }} />}
            </div>
        </div>
    )
}

type AccountCreationFormProps = {
    onSuccessAccountCreation: (data: Account) => void
    onError: () => void
}

function AccountCreationForm({onSuccessAccountCreation, onError}: AccountCreationFormProps) {
    const {register, errors, getValues, trigger} = useForm<Account>()
    const {get, response, loading} = useFetch("http://192.168.1.69:8001") 
    const [checkingEmailTakenDone, setCheckingEmailTakenDone] = useState(false)
    const [emailTaken, setEmailTaken] = useState<Boolean>(false)
    const [buttonDisactivated, setButtonDisactivated] = useState(true)

    let typingTimer: NodeJS.Timeout
    let doneTypingInterval = 1000
    
    function handleKeyUp( e: React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as keyof Account
        clearTimeout(typingTimer)
        typingTimer = setTimeout( async() => {
          await trigger(name)
          tryActivateButton()
        }, doneTypingInterval)
    }

    

    function handleKeyDown(e: React.FormEvent<HTMLInputElement>){
        clearTimeout(typingTimer)
    }

    function handleChange(e : React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as keyof Account
        trigger(name).then(() => tryActivateButton())
    }

    async function handleEmailBlur(e: React.FormEvent<HTMLInputElement>) {
      const name = e.currentTarget.name as keyof Account
      trigger(name).then(() => tryActivateButton())
      handleEmailAvailable()
  }


    function tryActivateButton() {
        const values = getValues()
       const allFieldsFilled = Object.keys(values).every((key)  => values[key as keyof Account] !== "")
       const noErrors = Object.keys(errors).length === 0

       if (allFieldsFilled && noErrors && checkingEmailTakenDone && !emailTaken) {
           setButtonDisactivated(false)
       } else {
           setButtonDisactivated(true)
       }
    }

    async function handleSubmit() {
      onSuccessAccountCreation(getValues())
    }

    async function handleEmailAvailable() {
      // const data: {taken: Boolean} = await get(`/api/users/email_available?${getValues().email}`)
      // if (!response.ok) {
      //   onError()
      //   return
      // }
      setCheckingEmailTakenDone(true)
      setEmailTaken(false)
      tryActivateButton()
    }

    return (
        <FormTemplate title="Create your Account">
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Name" type="text" name="name" innerRef={register({required: true, maxLength: 50})}  onChange={handleChange} />
                {errors.name && <small className="text-danger">Please provide a name.</small>}
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Email" type="email" name="email" innerRef={register({required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})} onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} onBlur={handleEmailBlur}   />
                {errors.email && <small className="text-danger">Please provide a valid email.</small>}
                {!errors.email && checkingEmailTakenDone && emailTaken && <small className="text-danger">Email already taken.</small> }
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Country" type="text" name="country" innerRef={register({required: true})}  onChange={handleChange}  />
                {errors.country && <small className="text-danger">Please provide your country.</small>}
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="City" type="text" name="city" innerRef={register({required: true})}  onChange={handleChange}  />
                {errors.city && <small className="text-danger">Please provide your city.</small>}
            </div>
            <p className="mb-0 p-0" style={{marginTop: "64px"}}>
                By signing up, you agree to our <a href="#1">Terms</a>, <a href="#1">Privicy Policy</a>, and <a href="#1">Cookie Use</a>.
            </p>
            <Button className="mt-3" onClick={handleSubmit} disabled={buttonDisactivated} type="button">Sign up</Button>
        </FormTemplate>
    )
}

type EmailVerificationFormProps = {
    email: string;
    onValidCode: () => void;
    onInvalidCode: () => void;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    onSuccess: () => void
}

function EmailVerificationForm({email, onValidCode, onInvalidCode, submitButtonRef, onSuccess}: EmailVerificationFormProps) {
    const { watch, register } = useForm<{code : string}>()
    const code = watch("code")
    
    useEffect(() => {
        if (code) {
            onValidCode()
        } else {
            onInvalidCode()
        }

    }, [onValidCode, onInvalidCode, code])

    if (submitButtonRef !== null && submitButtonRef.current !== null && submitButtonRef.current.onclick !== null) {
        submitButtonRef.current.onclick = handleSubmit
    }

    function handleSubmit(e : globalThis.MouseEvent) {
        console.log("Loading...")
        console.log("sending request with code ", code)
        setTimeout(() => {
            console.log("response back")
            onSuccess()
            console.log("Stopped Loading...")
        }, 3000)
    }

    return (
        <FormTemplate title="We sent you a code">
            <p className="m-0 p-0" >Enter it below to verify {email}</p>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Verification code" type="number" name="code" innerRef={register({required: true})} />
                <small>Didn't receive email?</small>
            </div>
        </FormTemplate>
    )
}

type PasswordCreationFormProps = {
    onValidPassword: () => void;
    onInvalidPassword: () => void;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    onSuccess: () => void
}

function PasswordCreationForm({onValidPassword, onInvalidPassword, submitButtonRef, onSuccess} : PasswordCreationFormProps) {
    const {register, watch, trigger} = useForm<{password: string}>()
    const password = watch("password")

    useEffect(() => {
        trigger("password")
        .then(valid => {
            if(valid) {
                onValidPassword()
            } else {
                onInvalidPassword()
            }
        })
    }, [trigger, onInvalidPassword, onValidPassword, password])

    if (submitButtonRef !== null && submitButtonRef.current !== null && submitButtonRef.current.onclick !== null) {
        submitButtonRef.current.onclick = handleSubmit
    }

    function handleSubmit(e : globalThis.MouseEvent) {
        console.log("Loading...")
        console.log("sending request with password ", password)
        setTimeout(() => {
            console.log("response back")
            onSuccess()
            console.log("Stopped Loading...")
        }, 3000)
    }

    return (
        <FormTemplate title="You'll need a password">
            <p className="m-0 p-0" >Make sure it's 8 characters or more.</p>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Password" type="password" name="password" innerRef={register({required: true, minLength: 8})} />
                <small>Reveal password</small>
            </div>
        </FormTemplate>
    )
}

type FormTemplateProps = {
    title: string,
    children: ReactNode
}

function FormTemplate({title, children}: FormTemplateProps) {
    return (
        <div className="d-flex flex-column align-items-stretch flex-grow-1 flex-shrink-1">
            <div className="d-flex flex-column align-items-stretch">
                <div className="d-flex flex-column align-items-stretch mx-4">
                    <h1 className="mt-3 mb-3 h4 fw-bolder">{title}</h1>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SignupPage