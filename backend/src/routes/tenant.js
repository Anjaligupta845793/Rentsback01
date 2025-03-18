const express = require("express");
const tenantController = require("../controller/tenant");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();


router.post("/tenant/profile",
    authMiddleware,
    tenantController.createTenant
);

router.get("/tenants", authMiddleware, tenantController.getAllTenants);
router.get("/tenants/:id", authMiddleware, tenantController.getTenantById);
router.post("/tenant/payable-amount", authMiddleware, tenantController.getPayableAmount);

router.get("/reward/calculate/:tenantId", authMiddleware, tenantController.getReward);


module.exports = router;

