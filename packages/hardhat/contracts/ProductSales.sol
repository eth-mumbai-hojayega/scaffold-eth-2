//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract ProductSales {
    struct SaleRecord {
        string productId;
        uint256 quantity;
        uint256 amountPaid;
    }

    mapping(address => SaleRecord[]) public sales;
    mapping(address => uint256) public totalSales;

    event ProductSold(address indexed buyer, string productId, uint256 quantity, uint256 amountPaid);
    event FundsTransferred(address indexed from, address indexed to, uint256 amount);

    function sellProduct(address _seller, string memory _productId, uint256 _quantity) external payable {
        uint256 requiredAmount = calculatePrice(_quantity);
        address _buyer = msg.sender;
        require(msg.value >= requiredAmount, "Insufficient funds sent");

        require(_quantity > 0, "Quantity must be greater than zero");

        SaleRecord memory record = SaleRecord(_productId, _quantity, requiredAmount);
        sales[_buyer].push(record);
        totalSales[_buyer] += requiredAmount;

        emit ProductSold(_buyer, _productId, _quantity, requiredAmount);
        transferToAddress(payable(_seller), requiredAmount);
    }

    function transferToAddress(address payable _to, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool success) = _to.send(_amount);
        require(success, "Transfer failed");
        emit FundsTransferred(address(this), _to, _amount);
    }

    function calculatePrice(uint256 _quantity) internal pure returns (uint256) {
        uint256 pricePerUnit = 0.000001 ether;
        return _quantity * pricePerUnit;
    }
}
