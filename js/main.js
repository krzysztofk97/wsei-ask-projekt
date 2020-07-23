let registers = {
    ax: "",
    bx: "",
    cx: "",
    dx: ""
}

function commandMOV(destination = "", source = "") {
    destination = destination.toLowerCase();
    source = source.toLowerCase();

    if (!isRegisterValid(source))
        modifyRegister(destination, source);
    else
        modifyRegister(destination, registers[source]);
}

function commandXCHG(destination = "", source = "") {
    destination = destination.toLowerCase();
    source = source.toLowerCase();
    let tmp = registers[source];

    modifyRegister(source, registers[destination]);
    modifyRegister(destination, tmp);
}

function isRegisterValid(reg) {
    if(registers[reg] == undefined)
        return false;
    else
        return true;
}

function modifyRegister(register = "", regValue) {
    registers[register.toLowerCase()] = regValue;
    document.getElementById(`input-${register.toLowerCase()}`).value = regValue;
}

function splitAndExecuteCommand(command = "") {
    let commandTypeEndIndex = command.indexOf(" ");
    let commandType = command.slice(0, commandTypeEndIndex);
    let args = command.slice(commandTypeEndIndex + 1).split(",");

    executeCommand(commandType, args);
}

function executeCommand(commandType = "", args = "" ) {

    try {
        switch(commandType.toLowerCase()) {
            case "mov":
                commandMOV(args[0].trim(), args[1].trim());
                break;

            case "xchg":
                commandXCHG(args[0].trim(), args[1].trim());
                break;
        }
    } catch {}
}

let commandSelectBuildier = new Array;

function updateCommandLinePlaceholder() {
    document.getElementById("command-line").placeholder = `${document.getElementById("command-select").value} ${commandSelectBuildier.join(", ")}`.toUpperCase();
    document.getElementById("command-line").value = null;
}

function commandSelectBuildierAdd (register){
    if(document.getElementById(`checkbox-${register}`).checked == true)
        commandSelectBuildier.push(register);
    else if (document.getElementById(`checkbox-${register}`).checked == false)
        commandSelectBuildier.splice(commandSelectBuildier.indexOf(register), 1);

    if (commandSelectBuildier.length > 2)
        document.getElementById(`checkbox-${commandSelectBuildier.pop()}`).checked = false;

    updateCommandLinePlaceholder();
}

function main() {
    let ax = document.getElementById("input-ax");
    let bx = document.getElementById("input-bx");
    let cx = document.getElementById("input-cx");
    let dx = document.getElementById("input-dx");

    let axCheckbox = document.getElementById("checkbox-ax");
    let bxCheckbox = document.getElementById("checkbox-bx");
    let cxCheckbox = document.getElementById("checkbox-cx");
    let dxCheckbox = document.getElementById("checkbox-dx");

    let commandLine = document.getElementById("command-line");
    let executeCommandButton = document.getElementById("execute-command");

    let commandSelect = document.getElementById("command-select");

    ax.value = registers.ax;
    bx.value = registers.bx;
    cx.value = registers.cx;
    dx.value = registers.dx;

    ax.addEventListener("input", () => {
        modifyRegister("ax", ax.value);
    });
    
    bx.addEventListener("input", () => {
        modifyRegister("bx", bx.value);
    });
    
    cx.addEventListener("input", () => {
        modifyRegister("cx", cx.value);
    });

    dx.addEventListener("input", () => {
        modifyRegister("dx", dx.value);
    });

    commandLine.addEventListener("keyup", key => {
        key.preventDefault();

        if(key.keyCode == "13") {
            splitAndExecuteCommand(commandLine.value.toLowerCase());
            commandLine.value = "";
        }
    });

    commandLine.addEventListener("input", () => {
        if(commandLine.value[0] == " ")
            commandLine.value = "";
        
        let commandArray = commandLine.value.split(/\s+/);
        commandArray[0] = commandArray[0].toUpperCase();

        commandLine.value = commandArray.join(" ");
    });
    
    axCheckbox.addEventListener("input", () => {
        commandSelectBuildierAdd("ax");
    });

    bxCheckbox.addEventListener("input", () => {
        commandSelectBuildierAdd("bx");
    });

    cxCheckbox.addEventListener("input", () => {
        commandSelectBuildierAdd("cx");
    });

    dxCheckbox.addEventListener("input", () => {
        commandSelectBuildierAdd("dx");
    });

    commandSelect.addEventListener("input", () =>{
        updateCommandLinePlaceholder();
    });

    executeCommandButton.addEventListener("click", () => {
        if (commandLine.value != "")
            splitAndExecuteCommand(commandLine.value.toLowerCase());
        else
            executeCommand(commandSelect.value, commandSelectBuildier);

        commandLine.value = "";
    });
}