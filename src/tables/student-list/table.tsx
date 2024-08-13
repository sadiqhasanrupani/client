import React from "react";

import { getAllStudentsHandler } from "@/http/get";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpError } from "@/lib/utils";
import { GetAllStudentPayload } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Card } from "@/components/ui/card";
import RefreshButton from "@/components/button/refresh-button";

export default function StudentTable() {
  const {
    data: getStudentsData,
    isLoading: getStudentsIsLoading,
    isRefetching: getStudentsIsRefetching,
    isError: getStudentIsError,
    error: getStudentsError,
    refetch: getStudentRefetch,
  } = useQuery<GetAllStudentPayload, HttpError>({
    queryKey: ["get-all-students"],
    queryFn: getAllStudentsHandler,
  });

  React.useEffect(() => {
    if (getStudentIsError) {
      toast.error(getStudentsError.message || "Something went wrong.");
    }
  }, [getStudentIsError, getStudentsError]);

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1>Student Lists</h1>
            <RefreshButton isRefetching={getStudentsIsRefetching} refetch={getStudentRefetch} />
          </div>
          {getStudentsIsLoading ? "loading..." : <DataTable columns={columns} data={getStudentsData?.users || []} />}
        </div>
      </Card>
    </>
  );
}
