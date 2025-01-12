"use client";
import React, { useEffect, useRef, useState } from "react";
import MainMap from "@/components/mainMap";
import { getDistance } from "ol/sphere";
import { Dialog } from "primereact/dialog";
import { PiKeyReturnFill } from "react-icons/pi";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";

const Home = () => {
  const [drawMode, setDrawMode] = useState<any>(null); // 'line' | 'polygon' | null
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [polygonwaypoints, setPolygonWaypoints] = useState<any[]>([]);
  const [createMissionModal, setCreateMissionModal] = useState<boolean>(false);
  const [selectedDataPoints, setSelectedDataPoints] = useState<any>(null);
  const op = useRef<any>(null);
  const [polygonStartType, setPolygonStartType] = useState<string>("");
  const [isPolygon, setIsPolygon] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>();
  const handleLineComplete = (coords: any[]) => {
    const newWaypoints = coords.map((point: any[], index) => {
      return {
        id: `${index + String(index + 1)}`,
        coords: point,
        distance: index > 0 ? getDistance(coords[index - 1], coords[index]) : 0,
      };
    });
    const wayPointsData: any[] = [...waypoints, ...newWaypoints];

    setWaypoints(wayPointsData);
    setDrawMode(null);
  };

  useEffect(() => {
    console.log("waypoints:", waypoints);
  }, [waypoints]);

  const coorsBody = (rowData: any) => {
    return (
      <p>
        {Array.isArray(rowData.coords) ? rowData.coords?.join(",") : rowData.coords}
      </p>
    );
  };

  const actionBody = (rowData: any) => {
    return (
      <h1
        className="cursor-pointer"
        onClick={(e) => {
          op.current.toggle(e);
          setSelectedData(rowData);
        }}
      >
        :
      </h1>
    );
  };

  const handlePolygonComplete = (coords: any[]) => {
    const newWaypoints = coords.map((point: any[], index) => {
      return {
        id: `${index + String(index + 1)}`,
        coords: point,
        distance: index > 0 ? getDistance(coords[index - 1], coords[index]) : 0,
      };
    });
    const wayPointsData: any[] = [...polygonwaypoints, ...newWaypoints];

    setPolygonWaypoints(wayPointsData);
    setDrawMode(null);
  };

  const importPolygon = () => {
    let newWaypoints = waypoints.map((points: any) => {
      if (selectedData.id == points.id) {
        return {
          id: points.id,
          coords: "Polygon",
          distance: "--",
          polygon: polygonwaypoints,
        };
      } else {
        return points;
      }
    });
    setPolygonWaypoints([]);
    setSelectedData(null);
    setIsPolygon(false);
    setWaypoints(newWaypoints);
    setDrawMode(null);
  };

  return (
    <div>
      <div className="header w-full flex justify-center">
        <button
          className="bg-[#1D243F] rounded-md p-3 m-2 font-semibold"
          onClick={() => setCreateMissionModal(true)}
        >
          Generate Data
        </button>
      </div>

      <div className="p-5 rounded-md">
        <MainMap
          drawMode={drawMode}
          onLineComplete={handleLineComplete}
          onPolygonComplete={handlePolygonComplete}
          polygonStartType={polygonStartType}
          selectedPoint={selectedData}
        />
      </div>

      <Dialog
        header="Mission Creation"
        visible={createMissionModal}
        position={"top-left"}
        modal={false}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!createMissionModal) return;
          setCreateMissionModal(false);
        }}
      >
        {!isPolygon ? (
          <>
            <div className="m-0 px-6 py-3 border-t-2 border-[#f5f5f5]">
              <p>Waypoints Navigation</p>
              <div className="waypoints my-2">
                <DataTable
                  value={waypoints}
                  selectionMode={"checkbox"}
                  selection={selectedDataPoints}
                  onSelectionChange={(e) => setSelectedDataPoints(e.value)}
                  dataKey="id"
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                  ></Column>
                  <Column field="id" header="WP"></Column>
                  <Column
                    field="coords"
                    body={coorsBody}
                    header="Coordinates"
                  ></Column>
                  <Column field="distance" header="Distance (m)"></Column>
                  <Column body={actionBody} header="Action"></Column>
                </DataTable>
              </div>
              <div
                className="my-5 p-4 flex flex-row items-center border bg-[#EEEEEE]"
                style={{ borderStyle: "dotted", borderWidth: "3px" }}
              >
                Click on the map to mark points of the route and then press{" "}
                <PiKeyReturnFill className="mx-2 text-lg" /> to complete the
                route.
              </div>
            </div>
            <div className="m-0 px-6 py-3 border-y-2 border-[#f5f5f5] flex flex-row justify-end mt-8">
              <Button
                className="px-3 py-1 bg-[purple] text-white font-semibold"
                onClick={() => setDrawMode("line")}
              >
                Generate Data
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="m-0 px-6 py-3 border-t-2 border-[#f5f5f5]">
              <Button
                onClick={() => setIsPolygon(false)}
                className="px-3 py-1 my-2 bg-[blue] text-white font-semibold"
              >
                Back to Mission Planner
              </Button>
              <p>Polygon Tool</p>
              <div className="waypoints my-2">
                <DataTable value={polygonwaypoints} dataKey="id">
                  <Column field="id" header="WP"></Column>
                  <Column
                    field="coords"
                    body={coorsBody}
                    header="Coordinates"
                  ></Column>
                  <Column field="distance" header="Distance (m)"></Column>
                </DataTable>
              </div>
              <div
                className="my-5 p-4 flex flex-row items-center border bg-[#EEEEEE]"
                style={{ borderStyle: "dotted", borderWidth: "3px" }}
              >
                Click on the map to mark points of the polygon's perimeter, then
                press enter to complete the polygon.
              </div>
            </div>
            <div className="m-0 px-6 py-3 border-y-2 border-[#f5f5f5] flex flex-row justify-between mt-8">
              <Button
                className="px-3 py-1 text-grey font-semibold"
                onClick={() => {
                  setPolygonWaypoints([]);
                  setSelectedData(null);
                  setIsPolygon(false);
                }}
              >
                Discard
              </Button>
              <Button
                className="px-3 py-1 bg-[purple] text-white font-semibold"
                onClick={() => importPolygon()}
              >
                Import Points
              </Button>
            </div>
          </>
        )}
      </Dialog>
      <OverlayPanel ref={op}>
        <ul>
          <li
            className="cursor-pointer my-1 hover:text-[purple] text-black font-semibold"
            onClick={() => {
              setIsPolygon(true);
              setPolygonStartType("before");
              setDrawMode("polygon");
            }}
          >
            Insert Polygon Before
          </li>
          <li
            className="cursor-pointer my-1 hover:text-[purple] text-black font-semibold"
            onClick={() => {
              setIsPolygon(true);
              setPolygonStartType("after");
              setDrawMode("polygon");
            }}
          >
            Insert Polygon After
          </li>
        </ul>
      </OverlayPanel>
    </div>
  );
};

export default Home;
