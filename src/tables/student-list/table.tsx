import React from "react";

import { getAllStudentsHandler } from "@/http/get";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpError } from "@/lib/utils";
import { GetAllStudentPayload } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Spinner from "@/components/loaders/spinner";

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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1>Student Lists</h1>
          <Button
            variant={"outline"}
            className="flex gap-1 items-center"
            onClick={() => getStudentRefetch()}
          >
            {getStudentsIsRefetching ? (
              <Spinner />
            ) : (
              <RefreshCw className="w-4" />
            )}
            <span>Refresh</span>{" "}
          </Button>
        </div>
        {getStudentsIsLoading ? (
          "loading..."
        ) : (
          <Card className="border-none ">
            <DataTable columns={columns} data={getStudentsData?.users || []} />
          </Card>
        )}
      </div>
    </>
  );
}
