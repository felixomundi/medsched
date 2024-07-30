"use client"

import { useEffect } from 'react';

function BootstrapClient() {
  useEffect(() => {
    require("jquery/dist/jquery");
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}

export default BootstrapClient;