import React from "react";

import { getAllClassroomsHandler } from "@/http/get";
import { HttpError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GetClassroomsPayload } from "@/types";
import { toast } from "sonner";
import Spinner from "@/components/loaders/spinner";
import { columns } from "./column";
import { DataTable } from "./data-table";

export default function ClassroomList() {
  const {
    data: classroomsData,
    isLoading: classroomsIsLoading,
    // isRefetching: classroomsIsRefetching,
    isError: classroomsIsError,
    error: classroomsError,
    // refetch: classroomsRefetch,
  } = useQuery<GetClassroomsPayload, HttpError>({
    queryKey: ["get-all-classrooms"],
    queryFn: getAllClassroomsHandler,
    gcTime: 0,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (classroomsIsError) {
      toast.error(classroomsError.code, {
        description: classroomsError.message,
      });
    }
  }, [classroomsIsError, classroomsError]);

  console.log(classroomsData);

  return (
    <div>
      {classroomsIsLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <DataTable data={classroomsData?.classrooms || []} columns={columns} />
      )}
    </div>
  );
}
