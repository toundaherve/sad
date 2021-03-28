import React, { MouseEvent, ReactNode, useState } from "react"
import { Button, Input } from "reactstrap"

const STEP_ACCOUNT_CREATION = "ACCOUNT_CREATION"
const STEP_EMAIL_VERIFICATION = "EMAIL_VERIFICATION "
const STEP_PASSWORD_CREATION = "PASSWORD_CREATION"

type Step = typeof STEP_ACCOUNT_CREATION | typeof STEP_EMAIL_VERIFICATION | typeof STEP_PASSWORD_CREATION

type Account = {
    name: string,
    email: string,
    password: string
}

function SignupPage() {
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState<Step>(STEP_ACCOUNT_CREATION)
    const [account, setAccount] = useState<Account>({name: "", email: "", password: ""})
    const [emailAvailable, setEmailAvailable] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [nextDisabled, setNextDisabled] = useState(true)

    function renderCurrentStepForm() {
        switch (currentStep) {
            case STEP_EMAIL_VERIFICATION:
                return <EmailVerificationForm email={account.email} code={verificationCode} onChange={handleChange} />
            case STEP_PASSWORD_CREATION:
                return <PasswordCreationForm password={account.password} onChange={handleChange} />
            default:
                return <AccountCreationForm account={account} onChange={handleChange} onBlur={checkEmailAvailability} onSubmit={next} emailAvailable={emailAvailable} />
        }
    }

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const {name, value} = e.currentTarget
        switch (name) {
            case "name":
                setAccount({...account, name: value})
                break;
            case "email":
                setAccount({...account, email: value})
                break;
            case "password":
                setAccount({...account, password: value})
                if (!account.password) {
                    setNextDisabled(true)
                } else {
                    setNextDisabled(false)
                }
                break;
            case "code":
                setVerificationCode(value)
                if (!verificationCode) {
                    setNextDisabled(true)
                } else {
                    setNextDisabled(false)
                }
                break;
            default:
                break;
        }
    }

    function next(e : MouseEvent<HTMLButtonElement>) {
        switch (currentStep) {
            case STEP_ACCOUNT_CREATION:
                setCurrentStep(STEP_EMAIL_VERIFICATION)
                break;
            case STEP_EMAIL_VERIFICATION:
                verifyEmail()
                setNextDisabled(true)
                break
            case STEP_PASSWORD_CREATION:
                finilizeAccountCreation()
                break
            default:
                break;
        }        

    }

    function previous(e : MouseEvent<HTMLButtonElement>) {
        switch (currentStep) {
            case STEP_ACCOUNT_CREATION:
                break;
            case STEP_EMAIL_VERIFICATION:
                setCurrentStep(STEP_ACCOUNT_CREATION)
                break
            case STEP_PASSWORD_CREATION:
                break
            default:
                break;
        }        

    }

    function checkEmailAvailability(e: React.FormEvent<HTMLInputElement>) {
        alert('Checking email availability')
        setEmailAvailable(true)
    }
    
    function verifyEmail(){
        alert('Verifiying email')
        setCurrentStep(STEP_PASSWORD_CREATION)
    }

    function finilizeAccountCreation() {
        alert('Finilizing account creation')
    }

    return (
        <div className="d-flex flex-column align-items-stretch min-vh-100">
            <div className="d-flex flex-column align-items-stretch flex-grow-1 flex-shrink-0 mx-auto w-100" style={{maxWidth: "600px"}}>
                <div className="d-flex flex-column align-items-stretch flex-shrink-0" style={{height: "53px", zIndex: 2}}>
                    <div className="d-flex flex-column align-items-stretch w-100">
                        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white px-3">
                            <div className="d-flex align-items-center justify-content-center" style={{minHeight: "53px"}}>
                                <span className="d-flex flex-column justify-content-center flex-grow-1 flex-shrink-1 align-items-start align-self-stretch" style={{minWidth: "56px", minHeight: "32px", flexBasis: "50%"}}>
                                    {currentStep === STEP_EMAIL_VERIFICATION && <Button onClick={previous}>Previous</Button>}
                                </span>
                                <span>Logo</span>
                                <span className="d-flex flex-column justify-content-center flex-grow-1 flex-shrink-1 align-items-end align-self-stretch" style={{minWidth: "56px", minHeight: "32px", flexBasis: "50%"}}>
                                    {currentStep !== STEP_ACCOUNT_CREATION && <Button onClick={next} disabled={nextDisabled}>Next</Button>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {renderCurrentStepForm()}
            </div>
        </div>
    )
}

type AccountCreationFormProps = {
    account: Account
    onBlur: React.FormEventHandler<HTMLInputElement>
    onChange: React.FormEventHandler<HTMLInputElement>
    onSubmit: React.MouseEventHandler<HTMLButtonElement>
    emailAvailable: boolean
}

function AccountCreationForm({account, onBlur, onChange, onSubmit,emailAvailable}: AccountCreationFormProps) {
    return (
        <FormTemplate title="Create your Account">
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Name" type="text" name="name" value={account.name} onChange={onChange} />
            </div>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Email" type="email" name="email" value={account.email} onChange={onChange} onBlur={onBlur} />
            </div>
            <p className="mb-0 p-0" style={{marginTop: "64px"}}>
                By signing up, you agree to our <a href="#1">Terms</a>, <a href="#1">Privicy Policy</a>, and <a href="#1">Cookie Use</a>.
            </p>
            <Button className="mt-3" disabled={!emailAvailable} onClick={onSubmit}>Sign up</Button>
        </FormTemplate>
    )
}

type EmailVerificationFormProps = {
    email: string,
    code: string,
    onChange: React.FormEventHandler<HTMLInputElement>
}

function EmailVerificationForm({email, code, onChange}: EmailVerificationFormProps) {
    return (
        <FormTemplate title="We sent you a code">
            <p className="m-0 p-0" >Enter it below to verify {email}.</p>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Verification code" type="number" name="code" value={code} onChange={onChange} />
                <small>Didn't receive email?</small>
            </div>
        </FormTemplate>
    )
}

type PasswordCreationFormProps = {
    password: string,
    onChange: React.FormEventHandler<HTMLInputElement>
}

function PasswordCreationForm({password, onChange}: PasswordCreationFormProps) {
    return (
        <FormTemplate title="You'll need a password">
            <p className="m-0 p-0" >Make sure it's 8 characters or more.</p>
            <div className="" style={{paddingTop: "12px", paddingBottom: "12px"}}>
                <Input placeholder="Password" type="password" name="password" value={password} onChange={onChange} />
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