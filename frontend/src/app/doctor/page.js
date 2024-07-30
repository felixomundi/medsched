import DoctorLayout from "../components/Doctor/DoctorLayout";
import DoctorDashBoard from "../components/Doctor/DoctorDashboard";
export const metadata = {
    title: "Doctor Dashboard"
}
export default function DoctorDashBoardPage(){
    return(<>
    <DoctorLayout allowedRoles={["doctor"]}>
        <DoctorDashBoard></DoctorDashBoard>
    </DoctorLayout>
    </>);

}