import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const RangeFilter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState([0, 1000]);
  const [tempRange, setTempRange] = useState([...range]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChange = (event, newValue) => {
    setTempRange(newValue);
  };

  const handleApplyRange = () => {
    setRange([...tempRange]);
    handleClose();
  };

  return (
    <div>
      <Typography
        id="range-slider"
        variant="h6"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
      >
        Price: £{range[0]} - {range[1]}
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={3} minWidth={300}>
          <Slider
            value={tempRange}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={1000}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography>{tempRange[0]}</Typography>
            <Typography>{tempRange[1]}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyRange}
            style={{ marginTop: 16 }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default RangeFilter;
