"use client";
import React, { ChangeEvent } from "react";
import { WheelItem } from "./MainWheelComp";
import { TextField, Slider, Box, Typography, Grid } from "@mui/material";

interface Props {
  wheelArr: WheelItem[];
  setWheelArr: React.Dispatch<React.SetStateAction<WheelItem[]>>;
}

export default function WheelEditor({ wheelArr, setWheelArr }: Props) {
  const handleChange = (
    id: number,
    field: keyof WheelItem,
    value: string | number
  ) => {
    setWheelArr((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <Box>
      {/* <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Edit Wheel Items
      </Typography> */}
      <Grid container spacing={2}>
        {wheelArr.map((item) => (
          <Grid
            key={item.id}
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 1,
            }}
          >
            {/* Title Input */}
            <TextField
              size="small"
              label="Title"
              variant="outlined"
              value={item.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(item.id, "title", e.target.value)
              }
              sx={{ flex: 2 }}
            />

            {/* Progress Slider */}
            <Box sx={{ flex: 3, px: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                {item.progress}/10
              </Typography>
              <Slider
                min={0}
                max={10}
                step={1}
                size="small"
                value={item.progress}
                onChange={(_, value) =>
                  handleChange(item.id, "progress", value as number)
                }
              />
            </Box>

            {/* Color Picker */}
            <TextField
              type="color"
              size="small"
              value={item.color}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(item.id, "color", e.target.value)
              }
              sx={{
                flex: 1,
                minWidth: 40,
                "& input": {
                  padding: 0,
                  height: 35,
                  cursor: "pointer",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
