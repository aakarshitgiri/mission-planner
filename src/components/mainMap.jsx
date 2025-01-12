"use client";
import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { OSM } from "ol/source";
import { Tile as TileLayer } from "ol/layer";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Draw } from "ol/interaction";

const MainMap = ({ drawMode, onLineComplete, onPolygonComplete, polygonStartType,selectedPoint }) => {
  const mapRef = useRef(null);
  const sourceRef = useRef(new VectorSource());
  const drawInteractionRef = useRef(null); // Ref to store the draw interaction

  useEffect(() => {
    // Initialize the OpenLayers map
    const baseLayer = new TileLayer({ source: new OSM() });
    const vectorLayer = new VectorLayer({ source: sourceRef.current });

    mapRef.current = new Map({
      target: "map",
      layers: [baseLayer, vectorLayer],
      view: new View({
        center: [0, 0], // Longitude, Latitude
        zoom: 2,
      }),
    });

    // Clean up the map on unmount
    return () => {
      mapRef.current.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !drawMode) return;
    // Create a new draw interaction
    console.log("selected dsta", selectedPoint)
    const draw = new Draw({
      source: sourceRef.current,
      type: drawMode === "line" ? "LineString" : "Polygon",
      coordinates: selectedPoint ? selectedPoint.coords:[]
    });

    drawInteractionRef.current = draw; // Store the draw interaction in the ref

    // Handle drawing end
    draw.on("drawend", (evt) => {
      const coordinates = evt.feature.getGeometry().getCoordinates();
      if (drawMode === "line") onLineComplete(coordinates);
      if (drawMode === "polygon") onPolygonComplete(coordinates);
    });

    mapRef.current.addInteraction(draw);

    // Clean up the interaction
    return () => {
      mapRef.current.removeInteraction(draw);
      drawInteractionRef.current = null;
    };
  }, [drawMode, onLineComplete, onPolygonComplete]);

  useEffect(() => {
    // Listen for the Enter key to finish drawing
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && drawInteractionRef.current) {
        drawInteractionRef.current.finishDrawing();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "80vh" }} />;
};

export default MainMap;
