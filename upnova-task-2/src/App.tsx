import './App.css';
import OTPInput from './components/OTPInput';

function App() {
        const validateOTP = (otp: string) => {
                return otp === '123456';
        };
        const onComplete = (otp: string) => {
                console.log(otp);
        };
        return (
                <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                        <h2 className="text-xl font-bold">We've emailed you a verification code</h2>
                        <p className="text-sm text-gray-500">
                                Please Enter the code below to verify your email address.
                        </p>
                        <OTPInput validateOTP={validateOTP} onComplete={onComplete} />
                        <div className="flex gap-1">
                                <p>Didn't receive the code?</p>
                                <p className="text-blue-500">Resend</p>
                        </div>
                </div>
        );
}

export default App;
