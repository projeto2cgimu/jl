var cone_points = [];
var cone_normals = [];
var cone_faces = [];
var cone_edges = [];

var cone_points_buffer;
var cone_normals_buffer;
var cone_faces_buffer;
var cone_edges_buffer;

var CONE_N = 20;

function coneAddEdge(a, b, c) {
	//cone_edges.push(a);
    cone_edges.push(b);
	cone_edges.push(0);
    
    
	//cone_edges.push(b);
	//cone_edges.push(CONE_N + 1);

	cone_edges.push(a);
	cone_edges.push(b);

	//cone_edges.push(a);
    cone_edges.push(b);
	cone_edges.push(c);

	//cone_edges.push(b);
	//cone_edges.push(d);
}

function coneAddFace(a, b, c) {
	cone_faces.push(a);
	cone_faces.push(c);
	cone_faces.push(b);
}

function coneAddTriangle(a, b, c) {
	cone_faces.push(a);
	cone_faces.push(b);
	cone_faces.push(c);
}

function coneBuild() {
	coneBuildVertices();
	coneBuildFaces();
	coneBuildEdges();
}


function coneBuildCircle(offset) {
	var o = 0;

	for (var i = 1; i < CONE_N  ; i++) {
		o = offset + i;
		
		coneAddTriangle(offset, o + 1, o);
        //coneAddTriangle(offset, o, o+1);
	}

	coneAddTriangle(offset, offset + 1, o+1);
    //coneAddTriangle(offset, o+1,offset + 1);

}


function coneBuildEdges() {
	//var offset = 0;
    var offset = CONE_N +1;
	var o = 0;
	
	//for (var i = 0; i < 3*(CONE_N); i++) {
    for (var i = 0; i < CONE_N -1; i++){
		o = offset + i *2 ;
       // o =  offset + i;
		
		//coneAddEdge(o, offset, o+1);
        coneAddEdge(o,o+1, o+3);
	}
    coneAddEdge(o+2, o+3, offset+1);
	//coneAddEdge(o+1, offset, offset+1);
}




function coneBuildFaces() {
	coneBuildCircle(0);
	//coneBuildCircle(CONE_N +1);
	coneBuildSurface(CONE_N +1);
}

function coneBuildSurface(offset) {
	var o = 0;

	for (var i = 1; i < CONE_N ; i++) {
		o = i;
		coneAddFace(o , offset , o + 1);

	}
    coneAddFace(offset-1, offset , 1 );


}


function coneBuildVertices() {
	var top = [];
	var bottom = [];
	var middle = [];

	var top_normals = [];
	var bottom_normals = [];
	var middle_normals = [];
	
	//var up = vec3(0, 1, 0);
	var down = vec3(0, -1, 0);
	
	//top.push(vec3(0, 0.5, 0));
    bottom.push(vec3(0, -0.5, 0));	

	//top_normals.push(up);
	bottom_normals.push(down);

	var segment = Math.PI *2 / CONE_N;
    	
	for (var i = 1; i <= CONE_N; i++) {
		var x = Math.cos(i * segment) * 0.5;
		var z = Math.sin(i * segment) * 0.5;
        
		//top.push(vec3(x, 0.5, z));
		bottom.push(vec3(x, -0.5, z));
		middle.push(vec3(0, 0.5, 0)); //ponto de cima
		middle.push(vec3(x, -0.5, z));
		
		var normal = normalize(vec3(x, 0, z));

		//top_normals.push(up);
		bottom_normals.push(down);
		middle_normals.push(normal);
		middle_normals.push(normal);
	}
    
	cone_points = top.concat(bottom).concat(middle)
	cone_normals = top_normals.concat(bottom_normals).concat(middle_normals)
}

function coneDrawFilled(gl, program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone_faces_buffer);
    gl.drawElements(gl.TRIANGLES, cone_faces.length, gl.UNSIGNED_SHORT, 0);
}

function coneDrawWireFrame(gl, program) { 
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone_edges_buffer);
    gl.drawElements(gl.LINES, cone_edges.length, gl.UNSIGNED_SHORT, 0);   
}

function coneInit(gl) {
	coneBuild();
	coneUploadData(gl);
}

function coneUploadData(gl) {
    cone_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cone_points), gl.STATIC_DRAW);    
    
    cone_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cone_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cone_normals), gl.STATIC_DRAW);
    
    cone_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cone_faces), gl.STATIC_DRAW);
    
    cone_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cone_edges), gl.STATIC_DRAW);
}
