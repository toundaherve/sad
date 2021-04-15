import React, {  ReactNode, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import useFetch from "use-http"
import { Link, useHistory } from "react-router-dom"
import { Button, Input } from "reactstrap"

const apiAddress = "http://192.168.1.69:8001"

type Account = {
    name: string;
    email: string;
    country: string;
    city: string;
}

type Step = "account_creation" | "email_verification" | "password_creation"

function SignupPage() {
    const {get, loading, response} = useFetch(apiAddress)
    const history = useHistory()
    const [visibleNextButton, setVisibleNextButton] = useState(false)
    const [visiblePreviousButton, setVisiblePreviousButton] = useState(false)
    const [disabledNextButton, setDisabledNextButton] = useState(true)
    const [disabledPreviousButton, setDisabledPreviousButton] = useState(false)
    const [currentStep, setCurrentStep] = useState<Step>("account_creation")
    const [account, setAccount] = useState<Account>({name: "", email: "", country: "", city: ""})
    const nextButtonRef = useRef(null) 

    async function handleSuccessAccountCreation(account : Account) {
      try {
        await requestEmailVerification(account.email)
        setAccount(account)
        setCurrentStep("email_verification")
        setVisibleNextButton(true)
        setVisiblePreviousButton(true)
      } catch (error) {
        alertError()
      }
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

    async function requestEmailVerification(email: String) {
      await get(`/api/onboarding/begin_verification?email=${email}`)
      // await Promise.resolve()
      if (!response.ok) {
       throw new Error("")
      }
    }

    function handleSignupComplete() {
      alert("Done!!")
      history.push("/")
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
               {currentStep === "email_verification" && <EmailVerificationForm email={account.email} onValidCode={() => setDisabledNextButton(false)} onInvalidCode={() => setDisabledNextButton(true)} submitButtonRef={nextButtonRef} onSuccess={handleSuccessEmailVerification} onError={alertError} />}
               {currentStep === "password_creation" && <PasswordCreationForm account={account} onValidPassword={() => setDisabledNextButton(false)} onInvalidPassword={() => setDisabledNextButton(true)} submitButtonRef={nextButtonRef} onSuccess={handleSignupComplete} onError={alertError} />}
            </div>
        </div>
    )
}

type AccountCreationFormProps = {
    onSuccessAccountCreation: (data: Account) => void
    onError: () => void
}

function AccountCreationForm({onSuccessAccountCreation, onError}: AccountCreationFormProps) {
    const {register, errors, getValues, trigger, formState} = useForm<Account>()
    const {get, response, loading} = useFetch(apiAddress) 
    const [checkingEmailTakenDone, setCheckingEmailTakenDone] = useState(false)
    const [emailTaken, setEmailTaken] = useState<Boolean>(true)
    const [buttonDisactivated, setButtonDisactivated] = useState(true)

    useEffect(() => {
      if (formState.isValid && checkingEmailTakenDone && !emailTaken){
        setButtonDisactivated(false)
      } else {
        setButtonDisactivated(true)
      }
    }, [formState, checkingEmailTakenDone, emailTaken])


    function handleChange(e : React.FormEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as keyof Account
        trigger(name).then(() => {
          if (name  === "email" && !errors.email) {
            handleEmailAvailable()
          }
        })
    }

    function handleSubmit(e : React.FormEvent<HTMLButtonElement>) {
      onSuccessAccountCreation(getValues())
    }

    async function handleEmailAvailable() {
      const data: {taken: Boolean} = await get(`/api/users/email_available?email=${getValues().email.trim()}`)
      if (!response.ok) {
        onError()
        return
      }
      setCheckingEmailTakenDone(true)
      setEmailTaken(data.taken)
    }

    return (
        <FormTemplate title="Create your Account">
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Name" type="text" name="name" innerRef={register({required: true, maxLength: 50})} onChange={handleChange} onBlur={handleChange}  />
                {errors.name && <small className="text-danger">Please provide a name.</small>}
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Email" type="email" name="email" innerRef={register({required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/})} onChange={handleChange} onBlur={handleChange} />
                {errors.email && <small className="text-danger">Please provide a valid email.</small>}
                {!errors.email && checkingEmailTakenDone && emailTaken && <small className="text-danger">Email already taken.</small> }
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Country" type="text" name="country" innerRef={register({required: true})}  onChange={handleChange} onBlur={handleChange}  />
                {errors.country && <small className="text-danger">Please provide your country.</small>}
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="City" type="text" name="city" innerRef={register({required: true})} onChange={handleChange} onBlur={handleChange}   />
                {errors.city && <small className="text-danger">Please provide your city.</small>}
            </div>
            <p className="mb-0 p-0" style={{marginTop: "64px"}}>
                By signing up, you agree to our <a href="#1">Terms</a>, <a href="#1">Privicy Policy</a>, and <a href="#1">Cookie Use</a>.
            </p>
            <Button onClick={handleSubmit} className="mt-3" disabled={buttonDisactivated} type="button">Sign up</Button>
        </FormTemplate>
    )
}

type EmailVerificationFormProps = {
    email: string;
    onValidCode: () => void;
    onInvalidCode: () => void;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    onSuccess: () => void
    onError: () => void
}

function EmailVerificationForm({email, onValidCode, onInvalidCode, submitButtonRef, onSuccess, onError}: EmailVerificationFormProps) {
    const {post, loading, response} = useFetch(apiAddress)
    const { watch, register } = useForm<{code : string}>()
    const [validCode, setValidCode] = useState(true)
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

    async function handleSubmit(e : globalThis.MouseEvent) {
      const data: {valid : Boolean} = await post("/api/onboarding/verify_code", {email, code})
      if (!response.ok) {
        onError()
      }

      if (!data.valid) {
        setValidCode(false)
      } else {
        setValidCode(true)
        onSuccess()
      }
    }

    return (
        <FormTemplate title="We sent you a code">
            <p className="m-0 p-0" >Enter it below to verify {email}</p>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Verification code" type="number" name="code" innerRef={register({required: true})} />
                {!validCode && <small className="d-block text-danger">Please a valid code.</small>}
                <small>Didn't receive email?</small>
            </div>
        </FormTemplate>
    )
}

type PasswordCreationFormProps = {
    account : Account;
    onValidPassword: () => void;
    onInvalidPassword: () => void;
    submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    onSuccess: () => void;
    onError: () => void;
}

function PasswordCreationForm({account, onValidPassword, onInvalidPassword, submitButtonRef, onSuccess, onError} : PasswordCreationFormProps) {
    const {post, loading, response} = useFetch(apiAddress)
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

    async function handleSubmit(e : globalThis.MouseEvent) {
      await post("/api/users", {...account, password})
      if (!response.ok) {
          onError()
          return
      }
      onSuccess()
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