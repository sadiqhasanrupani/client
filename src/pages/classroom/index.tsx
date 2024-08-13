import { useNavigate } from "react-router-dom";

// redux
import { AppUseSelector } from "@/store";

// components
import CreateButton from "@/components/button/create-button";
import ClassroomList from "@/tables/classroom-list/table";
import { Card } from "@/components/ui/card";

export default function Classroom() {
  const userRole = AppUseSelector((state) => state.userDetail.role);
  const navigate = useNavigate();

  return (
    <section>
      <Card className="p-4 flex flex-col gap-4">
        {" "}
        <h1>Classroom List</h1>
        <ClassroomList />
      </Card>
      {userRole === "principle" && <CreateButton onClick={() => navigate("create")} title="Create Classroom" />}
    </section>
  );
}
