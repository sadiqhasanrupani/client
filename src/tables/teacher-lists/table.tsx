import React from "react";

import { getAllTeachersHandler } from "@/http/get";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpError } from "@/lib/utils";
import { GetAllTeacherPayload } from "@/types";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Spinner from "@/components/loaders/spinner";

export default function TeacherTable() {
  const {
    data: getTeachersData,
    isLoading: getTeachersIsLoading,
    isRefetching: getTeacherIsRefetching,
    isError: getTeachersIsError,
    error: getTeachersError,
    refetch: getTeacherRefetch,
  } = useQuery<GetAllTeacherPayload, HttpError>({
    queryKey: ["get-all-teachers"],
    queryFn: getAllTeachersHandler,
  });

  React.useEffect(() => {
    if (getTeachersIsError) {
      toast.error(getTeachersError.message || "Something went wrong.");
    }
  }, [getTeachersIsError, getTeachersError]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1>Teacher Lists</h1>
          <Button
            variant={"outline"}
            className="flex gap-1 items-center"
            onClick={() => getTeacherRefetch()}
          >
            {getTeacherIsRefetching ? (
              <Spinner />
            ) : (
              <RefreshCw className="w-4" />
            )}
            <span>Refresh</span>{" "}
          </Button>
        </div>
        {getTeachersIsLoading ? (
          "loading..."
        ) : (
          <Card className="border-none ">
            <DataTable
              columns={columns}
              data={getTeachersData?.teacherDetails || []}
            />
          </Card>
        )}
      </div>
    </>
  );
}
