import { useEffect, useMemo, useState } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Team } from "../types/TeamDataType";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import type { NrrFormData } from "../types/NrrFormData";
import toast from "react-hot-toast";
import Select from "../components/Select";
import Button from "../components/Button";
import nrr from "../Apis/nrr";

const Home = () => {
  // State
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pointTableData, setPointTableData] = useState<Team[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<NrrFormData>({
    defaultValues: {
      your_team: "",
      opp_team: "",
      match_overs: undefined,
      desired_position: undefined,
      toss_result: "batting_first",
      runs_scored_chase: undefined,
    },
  });
  const TeamsList = pointTableData.map((team) => {
    return {
      label: team.team,
      value: team.team,
    };
  });

  // Effects
  useEffect(() => {
    fetchPointTableData();
  }, []);

  // Column Defination
  const columns = useMemo<ColumnDef<Team, any>[]>(
    () => [
      {
        id: "index",
        header: "Index",
        cell: ({ row }) => <span className="text-center">{row.index + 1}</span>,
      },
      {
        accessorKey: "team",
        header: "Team",
      },
      {
        accessorKey: "matches",
        header: "Matches",
      },
      {
        accessorKey: "won",
        header: "Won",
      },
      {
        accessorKey: "lost",
        header: "Lost",
      },
      {
        accessorKey: "nrr",
        header: "NRR",
      },
      {
        accessorKey: "forRuns",
        header: "For Runs/Overs",
        cell: ({ row }) => (
          <span>
            {row.original.forRuns}/{row.original.forOvers}
          </span>
        ),
      },
      {
        accessorKey: "againstRuns",
        header: "Against Runs/Overs",
        cell: ({ row }) => (
          <span>
            {row.original.againstRuns}/{row.original.againstOvers}
          </span>
        ),
      },
      {
        accessorKey: "points",
        header: "Points",
      },
    ],
    []
  );

  // Helper Functions
  const fetchPointTableData = async () => {
    setTableIsLoading(true);
    try {
      const pointTableData = await nrr.fetchPointTableData();
      if (pointTableData.success) {
        setPointTableData(pointTableData?.data);
        setValue("your_team", pointTableData?.data[0]?.team);
        setValue("opp_team", pointTableData?.data[0]?.team);
      } else {
        throw new Error(pointTableData?.message);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error?.message ?? "Failed To Fetch Point Table");
    } finally {
      setTableIsLoading(false);
    }
  };

  const submit = async (formData: NrrFormData) => {
    try {
      const calculatedNrr = await nrr.calculateNrr(formData);
      setIsLoading(true);
      if (calculatedNrr.success) {
        setResponseMessage(calculatedNrr?.data);
        toast.success("Calculation successful!");
      } else {
        throw new Error(calculatedNrr?.message);
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-[105rem] grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl rounded-3xl bg-white/80 p-6 md:p-10 border border-gray-200">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-6 tracking-wide text-center">
            IPL Points Table
          </h1>
          <div className="w-full overflow-x-auto rounded-xl shadow-lg bg-white">
            <Table
              columns={columns}
              data={pointTableData}
              rowCount={10}
              isLoading={isTableLoading}
              emptyTableChild={
                <div className="text-center py-12">
                  <p className="text-gray-500">Team Not Found</p>
                </div>
              }
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 tracking-wide text-center">
            NRR Calculator
          </h1>
          <form
            className="w-full max-w-md space-y-5 bg-white/90 rounded-xl shadow-lg p-6"
            onSubmit={handleSubmit(submit)}
          >
            <Select
              label="Your Team"
              options={TeamsList}
              register={register("your_team", {
                required: "Your Team is required",
              })}
              required
              error={errors.your_team?.message}
              disabled={isLoading}
            />
            <Select
              label="Opposition Team"
              options={TeamsList}
              register={register("opp_team", {
                required: "Opposition Team is required",
                validate: (value) => {
                  if (watch("your_team") === value) {
                    return "Opposition Team Should Be diffrent From Your Team";
                  }
                  return true;
                },
              })}
              required
              error={errors.opp_team?.message}
              disabled={isLoading}
            />
            <Input
              error={errors.match_overs?.message}
              label={"Match Overs"}
              name={"match_overs"}
              type="number"
              required
              register={register("match_overs", {
                required: "Match Overs is required",
                validate: (value) => {
                  if (value < 1) {
                    return `Desired Position must be between 1 and ${pointTableData.length}`;
                  }
                  return true;
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter Match Overs"
              disabled={isLoading}
            />
            <Input
              error={errors.desired_position?.message}
              label={"Desired Position for Your Team in Points Table"}
              name={"desired_position"}
              type="number"
              required
              register={register("desired_position", {
                required: "Desired Position is required",
                validate: (value) => {
                  if (value < 1 || value > pointTableData.length) {
                    return `Desired Position must be between 1 and ${pointTableData.length}`;
                  }
                  return true;
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter Desired Position"
              disabled={isLoading}
            />
            <Select
              label="Toss Result"
              defaultValue="batting_first"
              options={[
                { label: "Batting First", value: "batting_first" },
                { label: "Bowling First", value: "bowling_first" },
              ]}
              register={register("toss_result", {
                required: "Toss Result is required",
              })}
              required
              error={errors.toss_result?.message}
              disabled={isLoading}
            />
            <Input
              error={errors.runs_scored_chase?.message}
              label={"Runs Scored / Runs to Chase"}
              name={"runs_scored_chase"}
              type="number"
              required
              register={register("runs_scored_chase", {
                required: "Runs Scored / Runs to Chase is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter Runs"
              disabled={isLoading}
            />
            <div className="flex gap-4 justify-center mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-32 h-10 text-base font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500 transition-colors duration-300"
              >
                {isLoading ? "Calculating..." : "Calculate"}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  reset();
                  setResponseMessage("");
                }}
                disabled={isLoading}
                className="w-32 h-10 text-base font-semibold rounded-lg shadow-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
              >
                Reset
              </Button>
            </div>
          </form>
          {responseMessage && (
            <div className="w-full max-w-md mt-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-center">
              <h2 className="text-xl font-bold text-purple-700 mb-2">Result</h2>
              <p className="text-lg text-gray-800">{responseMessage}</p>
            </div>
          )}
        </div>
      </div>
      <div className="block md:hidden h-8" />
    </div>
  );
};

export default Home;
