from dataclasses import dataclass
import fiona
import pprint
import numpy as np
from matplotlib import pyplot as p
import math
import random
import sys


class UuidGenerator:
    """
    It can use default uuid generator which will give streets unique ids aka names,
        but for debugging purposes it is better to use a counter
    """

    def __init__(self):
        self.counter = 0

    def getUuid(self):
        self.counter += 1
        return self.counter


"""
    For easy debugging created special FAILED_LINE_STREET where I place troublesome lines.
    Then a I draw them with black color.
"""
FAILED_LINE_STREET = 'failed_line_street'

"""
    Sometimes during drawing streets are drawn the same color even if they colors are chosen randomly.
    So I added LINE_STYLES to choose random style. 
    Lines will differ visually even if colors are occasionally the same.
"""
LINE_STYLES = [
    'solid',
    'dashed',
    'dashdot',
    'dotted'
]


class EatingError(Exception):
    def __init__(self, eater: 'Street', eatee: 'Street') -> None:
        self.message = f'{eater.streetUuid} cannot eat {eatee.streetUuid}'
        self.eater = eater
        self.eatee = eatee
        super().__init__(self.message)


class AddLineError(Exception):
    def __init__(self, adder: 'Street', line: 'Line') -> None:
        self.message = f'error adding line {line} to {adder.streetUuid}'
        self.adder = adder
        self.line = line
        super().__init__(self.message)

    def handle(self, processedStreets, failedStreets):
        print("Handling  AddLineError:")
        self.adder.color = 'red'
        circled = " and circled" if e.adder.circled() else ""
        pprint.pprint(f"Adder lines ({self.adder.color}){circled}:")
        pprint.pprint(self.adder.lines)
        failedStreets.append(self.adder)
        processedStreets.pop(self.adder.streetUuid)

        failedLineStreet = Street(FAILED_LINE_STREET, [self.line])
        failedLineStreet.color = 'black'
        pprint.pprint(f"Troublesome line ({failedLineStreet.color}):")
        pprint.pprint(failedLineStreet.lines)
        failedStreets.append(failedLineStreet)

class ForeverRotationError(Exception):
    def __init__(self, rotator: 'Street', line: 'Line') -> None:
        self.line = line
        self.rotator = rotator
        self.message = f'Street {rotator.streetUuid} is forever rotated'
        super().__init__(self.message)

    def handle(self, processedStreets, failedStreets):
        print("Handling  ForeverRotationError:")
        self.rotator.color = 'red'
        circled = " and circled" if e.rotator.circled() else ""
        pprint.pprint(f"Rotator lines ({self.rotator.color}){circled}:")
        pprint.pprint(self.rotator.lines)
        failedStreets.append(self.rotator)
        processedStreets.pop(self.rotator.streetUuid)

        failedLineStreet = Street(FAILED_LINE_STREET, [self.line])
        failedLineStreet.color = 'black'
        pprint.pprint(f"Troublesome line ({failedLineStreet.color}):")
        pprint.pprint(failedLineStreet.lines)
        failedStreets.append(failedLineStreet)

def unit_vector(vector):
    """ Returns the unit vector of the vector.  """
    return vector / np.linalg.norm(vector)


def angle_between_vectors(v1, v2):
    """ 
        Returns the angle in degrees between vectors 'v1' and 'v2'::
        But it will not return broader than 180 degrees.
    """
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    degrees = math.degrees(np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0)))
    if degrees > 180:
        degrees = 360 - degrees
    return degrees


@dataclass
class Line:
    """
        start - start point of the line (x,y)
        end - end point of the line (x,y)
        street - reference to Street object, by default None
    """
    start: tuple
    end: tuple
    street = None

    def __hash__(self) -> int:
        """
            For this implementation it's convenient to have the same hash of lines like ((x1,y1),(x2,y2)) or ((x2,y2),(x1,y1))
            Because sometimes in my algo I 'flip' the line to add it to street more easily.
        """
        if (self.start > self.end):
            return hash((self.start, self.end))
        else:
            return hash((self.end, self.start))

    def __eq__(self, other) -> bool:
        """
            Reason same as is in __hash__.
            I.e. lines ((x1,y1),(x2,y2)) and ((x2,y2),(x1,y1)) are equal.
        """
        if self.start == other.start and self.end == other.end or self.start == other.end and self.end == other.start:
            return True

    def flip(self):
        """
            Flips the line.
            I.e. ((x1,y1),(x2,y2)) becomes ((x2,y2),(x1,y1))
        """
        self.start, self.end = self.end, self.start


@dataclass
class VectorFromLine:
    """
        Returns the vector from the basePoint to the point of the line.

        |  _. ('point' aka (width,height) is local to vector)
        |  /|
        | /
        |/_______
        ^
        ('basePoint' is absolute coordinate)

    """
    point: tuple
    line: Line
    basePoint: tuple

    def __init__(self, start, end, line, basePoint) -> None:
        self.point = (end[0] - start[0], end[1] - start[1])
        self.line = line
        self.basePoint = basePoint


@dataclass
class TwoVectors:
    """
        Convenient method to store the angle between pair of vectors.
        Between v1 and v2 vectors

         (v2)._  |  _.(v1)
             |\  |  /|
               \ | /
            ____\|/____
    """
    vector1: VectorFromLine
    vector2: VectorFromLine
    angle: float

    def __init__(self, v1, v2) -> None:
        self.vector1 = v1
        self.vector2 = v2
        self.angle = angle_between_vectors(v1.point, v2.point)


@dataclass
class Street:
    """
        Holds references to lines that are connected to this street. I.e. owns them.
        streetUuid - unique id of the street, aka name
        color - for convenient work with matplotlib
    """
    lines: list
    streetUuid = None
    color = None

    def __init__(self, streetUuid, lines) -> None:
        self.streetUuid = streetUuid
        self.lines = []
        for line in lines:
            self.addLine(line)
    
    def circled(self) -> bool:
        if len(lines) < 3:
            return False
        if self.lines[0].start == self.lines[-1].end:
            return True
    
    def rotateCircle(self):
        first = self.lines[0]
        self.lines.pop(0)
        self.lines.append(first)

    def addLine(self, line) -> None:
        if len(self.lines) == 0:
            self.lines.append(line)
            line.street = self
            return
        """
            '_' - not important for the example.
            Adds line to the street. But in a smart way.
        """
        if self.lines[0].start == line.start or self.lines[-1].end == line.end:
            """
                Check two cases below before.
                This step just flips the line if it's needed.
            """
            line.flip()
        if self.lines[0].start == line.end:
            """
                Case 1.
                line = (a,b)----(c,d) 
                self = (c,d)--...--(_,_)
                    -> prepending line to self.lines ->
                self = (a,b)----(c,d)---...---(_,_)
            """
            self.lines.insert(0, line)
        elif self.lines[-1].end == line.start:
            """
                Case 2.
                line = (a,b)----(c,d) 
                self = (_,_)--...--(a,b)
                    -> appending line to self.lines ->
                self = (_,_)--...--(a,b)----(c,d)
            """
            self.lines.append(line)
        elif self.circled():
            """
                Case 3.
                a--b b--c
                     |  |
                     e--f 
                self = f--e--b--c, f = start, c = end
                line = a--b
                'b' needs to be either start or end, so rotate the circle till 'b' becomes either start or end.
                P.S. In order not to rotate forever, we check if the circle rotated less than len(self.lines) times.
            """
            rotateCounter = 0
            while not (self.lines[0].start == line.end or self.lines[0].start == line.start):
                self.rotateCircle()
                rotateCounter += 1
                if rotateCounter > len(self.lines):
                    raise ForeverRotationError(self, line)
            self.addLine(line)
        else:
            raise AddLineError(self, line)
        """ Take ownership of the line. """
        line.street = self

    def eat(self, another) -> None:
        """
            Takes ownership of another street's lines.
        """
        assert self != another

        selfStart = self.lines[0].start
        selfEnd = self.lines[-1].end

        anotherStartA = another.lines[0].start
        anotherStartB = another.lines[0].end

        try:
            if selfStart == anotherStartA or selfStart == anotherStartB or selfEnd == anotherStartA or selfEnd == anotherStartB:
                """
                    Here we check if the streets are connected.
                    And how should we 'eat' other street, from the start or from the end.
                    If another street connected with current street from the start, we should eat it from the start.
                    Otherwise, we should eat it from the end.
                """
                for line in another.lines:
                    self.addLine(line)
            else:
                for line in reversed(another.lines):
                    self.addLine(line)
        except AddLineError as e:
            print("Trouble line:")
            pprint.pprint(e.line)
            raise EatingError(self, another)

    def getXY(self):
        """
            Returns the list of all points that are on the street, convenient for matplotlib.
        """
        x = []
        y = []
        for line in self.lines:
            x.append(line.start[0])
            x.append(line.end[0])
            y.append(line.start[1])
            y.append(line.end[1])
        return x, y


def getPairWithShallowestAngle(vectors):
    assert len(vectors) > 1
    maxPair = None
    for iv in range(len(vectors)):
        for jv in range(iv + 1, len(vectors)):
            currentPair = TwoVectors(vectors[iv], vectors[jv])
            if maxPair is None or currentPair.angle > maxPair.angle:
                maxPair = currentPair
    return maxPair


def getLinesFromShapeFile(shapeFilePath):
    with fiona.open(shapeFilePath, "r") as source:
        lines = []
        for f in source:
            coords = f['geometry']['coordinates']
            for i in range(len(coords) - 1):
                start = (coords[i][0], coords[i][1])
                end = (coords[i+1][0], coords[i+1][1])
                l = Line(start, end)
                lines.append(l)
    return lines


def getCrossroadsFromLines(lines):
    """
        Crossroads are the points with at least one line connected.
        1. Crossroad with one line     .___
        2. Crossroad with two lines ___.___
                                         |
        3. Crossroad with three lines ___.___
        etc.
    """
    crossroads = dict()
    for line in lines:
        start = line.start
        if crossroads.get(start) == None:
            crossroads[start] = set([line])
        else:
            crossroads[start].add(line)
        end = line.end
        if crossroads.get(end) == None:
            crossroads[end] = set([line])
        else:
            crossroads[end].add(line)
    return crossroads


def getVectorsFromCrossroad(crossroadPoint, lines):
    """
        Converts connected lines to crossroad point to a list of vectors.
                   ^
                  /
        Like <---.------->
    """
    vectors = []
    for line in lines:
        lStart = line.start
        lEnd = line.end
        if line.end == point:
            lStart = line.end
            lEnd = line.start
        vectors.append(VectorFromLine(lStart, lEnd, line, crossroadPoint))
    return vectors

def drawingAndSavingImages(streets, failedStreets, pathToInitialImage, pathToImage):
    figure = p.gcf()
    figure.set_size_inches(10, 10)

    if pathToInitialImage:
        for line in lines:
            xs = [line.start[0], line.end[0]]
            ys = [line.start[1], line.end[1]]
            p.plot(xs, ys)
        p.savefig(pathToInitialImage, dpi=300)
        p.show(block=False)
        p.clf()

    for streetUuid, street in streets.items():
        x, y = street.getXY()
        p.plot(x, y, linestyle=random.choice(LINE_STYLES))

    if len(failedStreets) > 0:
        print(f"Failed streets: {len(failedStreets)}")
        for failedStreet in failedStreets:
            x, y = failedStreet.getXY()
            p.plot(x, y, color=failedStreet.color)

    if pathToImage:
        p.savefig(pathToImage, dpi=300)

    figure.set_size_inches(8, 8)
    p.show()


def processArgs():
    pathToShapeFile = None
    pathToImage = None
    pathToInitialImage = None
    if len(sys.argv) < 2:
        print("Usage: python3 main.py <shapeFilePath> <?outputImageFilePath> <?initialImageFilePath>")
        exit(0)
    if len(sys.argv) >= 2:
        pathToShapeFile = sys.argv[1]
    if len(sys.argv) >= 3:
        pathToImage = sys.argv[2]
    if len(sys.argv) >= 4:
        pathToInitialImage = sys.argv[3]
    return pathToShapeFile, pathToImage, pathToInitialImage

if __name__ == '__main__':
    streetUuidGenerator = UuidGenerator()

    pathToShapeFile, pathToImage, pathToInitialImage = processArgs()

    lines = getLinesFromShapeFile(pathToShapeFile)
    crossroads = getCrossroadsFromLines(lines)
    streets = dict()
    failedStreets = []

    def UnassignedLine(l): return l.street == None

    def BothLinesAreNotAssignedToStreets(
        l1, l2): return l1.street == None and l2.street == None

    def FirstNotAssignedSecondAssigned(
        l1, l2): return l1.street == None and l2.street != None

    def BothLinesAreAssignedAndDifferent(
        l1, l2): return l1.street != None and l2.street != None and l1.street != l2.street

    def OneAssignedAnotherUnassigned(l1, l2): return FirstNotAssignedSecondAssigned(
        l1, l2) or FirstNotAssignedSecondAssigned(l2, l1)

    """
        Iterates all crossroads :
            Then gets vectors from crossroad.
            Get shallowest vector pair until there are < 1 vectors left :
                a. If both are unassigned to streets, then creates a street.
                b. If one is unassigned and another is assigned to a street, then adds the line to the already assigned streat.
                c. If both are assigned to different streets, then tries to eat the other street. (Eat - append other's lines to the street)
                Remove 2 processed vectors.
            If one vector left and it is unassigned, then create a street for a lone line.
    """
    try:
        for point, lineSet in crossroads.items():
            vectors = getVectorsFromCrossroad(point, lineSet)
            while len(vectors) > 1:
                pair = getPairWithShallowestAngle(vectors)
                l1, l2 = pair.vector1.line, pair.vector2.line
                assert l1 is not l2
                if BothLinesAreNotAssignedToStreets(l1, l2):
                    streetUuid = streetUuidGenerator.getUuid()
                    assert streets.get(streetUuid) is None
                    streets[streetUuid] = Street(streetUuid, [l1, l2])
                elif OneAssignedAnotherUnassigned(l1, l2):
                    assignedLine = l1 if l1.street is not None else l2
                    unassignedLine = l1 if l1.street is None else l2
                    try:
                        assignedLine.street.addLine(unassignedLine)
                    except AddLineError as e:
                        e.handle(streets, failedStreets)
                elif BothLinesAreAssignedAndDifferent(l1, l2):
                    uuidToRemove = l2.street.streetUuid
                    l1.street.eat(l2.street)
                    assert streets.get(uuidToRemove) is not None
                    streets.pop(uuidToRemove)
                vectors.remove(pair.vector1)
                vectors.remove(pair.vector2)
            if len(vectors) == 1:
                aloneLine = vectors[0].line
                if UnassignedLine(aloneLine):
                    streetUuid = streetUuidGenerator.getUuid()
                    streets[streetUuid] = Street(streetUuid, [vectors[0].line]) 
    except AddLineError as e:
        e.handle(streets, failedStreets)
    except EatingError as e:
        e.eater.color = 'black'
        print(f"Eater ({e.eater.color}): {e.eater.lines}")

        e.eatee.color = 'red'
        print(f"Eatee ({e.eater.color}): {e.eatee.color}")
    except ForeverRotationError as e:
        e.handle(streets, failedStreets)
    drawingAndSavingImages(streets, failedStreets, pathToInitialImage, pathToImage)