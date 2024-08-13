import React from "react";

import { getAllClassroomsHandler } from "@/http/get";
import { HttpError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GetClassroomsPayload } from "@/types";
import { toast } from "sonner";
import Spinner from "@/components/loaders/spinner";
import { columns } from "./column";
import { DataTable } from "./data-table";
import RefreshButton from "@/components/button/refresh-button";

export default function ClassroomList() {
  const {
    data: classroomsData,
    isLoading: classroomsIsLoading,
    isRefetching: classroomsIsRefetching,
    isError: classroomsIsError,
    error: classroomsError,
    refetch: classroomsRefetch,
  } = useQuery<GetClassroomsPayload, HttpError>({
    queryKey: ["get-all-classrooms"],
    queryFn: getAllClassroomsHandler,
  });

  React.useEffect(() => {
    if (classroomsIsError) {
      toast.error(classroomsError.code, {
        description: classroomsError.message,
      });
    }
  }, [classroomsIsError, classroomsError]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end w-full">
        <RefreshButton isRefetching={classroomsIsRefetching} refetch={classroomsRefetch} />
      </div>
      {classroomsIsLoading ? (
        <div className="w-full h-32 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <DataTable data={classroomsData?.classrooms || []} columns={columns} />
      )}
    </div>
  );
}
