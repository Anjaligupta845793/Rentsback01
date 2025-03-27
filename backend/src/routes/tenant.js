const express = require("express");
const tenantController = require("../controller/tenant");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();


router.post("/tenant/form1",
    authMiddleware,
    tenantController.createTenant
);

router.get("/tenants", authMiddleware, tenantController.getAllTenants);
router.get("/tenants/:id", authMiddleware, tenantController.getTenantById);
router.post("/tenant/payable-amount", authMiddleware, tenantController.getPayableAmount);

router.get("/reward/calculate/:tenantId", authMiddleware, tenantController.getReward);
router.get("/reward/tokens/:tenantId", authMiddleware, tenantController.getAllToken);

router.post("/isclaimable/:tenantId", authMiddleware, tenantController.isClaimableToken);
router.post("/terminate/:tenantId", authMiddleware, tenantController.terminateTenant);
router.get("/isterminate/:tenantId", authMiddleware, tenantController.isTerminateTenant);

router.post("/tenant/form2/:tenantId",
    authMiddleware,
    tenantController.createTenantFrom2
);

router.get("/dashboard", authMiddleware, tenantController.getDashboardData);


module.exports = router;

