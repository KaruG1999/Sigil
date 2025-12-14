# Test Contracts for Sigil Scanner

Contratos de prueba con vulnerabilidades conocidas para testear el escáner.

---

## 1. Honeypot Token (Trading Toggle)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HoneypotToken {
    string public name = "Honey Token";
    string public symbol = "HONEY";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public owner;
    bool public tradingEnabled = false;
    mapping(address => bool) public isBlacklisted;

    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // HONEYPOT: Owner can enable/disable trading at will
    function setTradingEnabled(bool _enabled) external onlyOwner {
        tradingEnabled = _enabled;
    }

    // HONEYPOT: Owner can blacklist any address
    function setBlacklist(address _addr, bool _blacklisted) external onlyOwner {
        isBlacklisted[_addr] = _blacklisted;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(tradingEnabled || msg.sender == owner, "Trading disabled");
        require(!isBlacklisted[msg.sender], "Blacklisted");
        require(!isBlacklisted[to], "Recipient blacklisted");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(tradingEnabled || from == owner, "Trading disabled");
        require(!isBlacklisted[from], "Sender blacklisted");
        require(!isBlacklisted[to], "Recipient blacklisted");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
```

---

## 2. Rug Pull Token (Owner Mint + Hidden Fee)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RugPullToken {
    string public name = "Safe Moon 2.0";
    string public symbol = "SAFEMOON2";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public owner;
    uint256 public taxFee = 5; // Looks like 5%
    uint256 private _hiddenFee = 95; // Actually takes 95%!
    address private _feeReceiver;

    constructor() {
        owner = msg.sender;
        _feeReceiver = msg.sender;
        totalSupply = 1000000000 * 10**18;
        balanceOf[msg.sender] = totalSupply;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // RUG PULL: Owner can mint unlimited tokens
    function mint(address to, uint256 amount) external onlyOwner {
        totalSupply += amount;
        balanceOf[to] += amount;
    }

    // RUG PULL: Owner can change fee to 100%
    function setFee(uint256 _fee) external onlyOwner {
        _hiddenFee = _fee;
    }

    // RUG PULL: Owner can drain all ETH
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        uint256 fee = (amount * _hiddenFee) / 100;
        uint256 transferAmount = amount - fee;

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += transferAmount;
        balanceOf[_feeReceiver] += fee;

        return true;
    }

    receive() external payable {}
}
```

---

## 3. Reentrancy Vulnerable Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // CRITICAL: Reentrancy vulnerability
    function withdraw() external {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance");

        // BUG: Sends ETH before updating state
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        // State updated AFTER external call - vulnerable!
        balances[msg.sender] = 0;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
```

---

## 4. Self-Destruct Backdoor

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BackdoorContract {
    address public owner;
    mapping(address => uint256) public deposits;

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        deposits[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient");
        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // CRITICAL: Owner can destroy contract and steal all funds
    function emergencyWithdraw() external {
        require(msg.sender == owner, "Not owner");
        selfdestruct(payable(owner));
    }

    // DANGEROUS: Arbitrary external call
    function execute(address target, bytes calldata data) external {
        require(msg.sender == owner, "Not owner");
        (bool success, ) = target.call(data);
        require(success, "Call failed");
    }
}
```

---

## 5. Delegatecall Proxy Attack

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaliciousProxy {
    address public implementation;
    address public owner;

    constructor(address _impl) {
        implementation = _impl;
        owner = msg.sender;
    }

    // CRITICAL: Anyone can change implementation
    function upgrade(address newImpl) external {
        implementation = newImpl;
    }

    // DANGEROUS: Delegatecall to arbitrary address
    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}
```

---

## 6. Max Transaction Honeypot

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MaxTxHoneypot {
    string public name = "Elite Token";
    string public symbol = "ELITE";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;

    mapping(address => uint256) public balanceOf;
    address public owner;

    uint256 public maxTxAmount = 1000 * 10**18; // Public max
    uint256 private _realMaxTx = 1; // Secret: only 1 wei allowed!
    mapping(address => bool) private _isExcluded;

    constructor() {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
        _isExcluded[msg.sender] = true;
    }

    // HONEYPOT: Shows fake max, real max is 1 wei
    function transfer(address to, uint256 amount) external returns (bool) {
        if (!_isExcluded[msg.sender]) {
            require(amount <= _realMaxTx, "Exceeds max");
        }

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    // Owner can exclude themselves from limits
    function excludeFromLimit(address addr) external {
        require(msg.sender == owner);
        _isExcluded[addr] = true;
    }
}
```

---

## Uso

1. Copia cualquiera de estos contratos
2. Ve a la sección "Paste Code" en Sigil
3. Pega el código y ejecuta el análisis
4. Verifica que el escáner detecte las vulnerabilidades

## Vulnerabilidades esperadas

| Contrato | Vulnerabilidades |
|----------|------------------|
| HoneypotToken | Trading toggle, Blacklist, Centralized control |
| RugPullToken | Owner mint, Hidden fees, ETH drain |
| VulnerableVault | Reentrancy |
| BackdoorContract | Selfdestruct, Arbitrary call |
| MaliciousProxy | Unprotected upgrade, Delegatecall |
| MaxTxHoneypot | Hidden max transaction, Excluded addresses |
